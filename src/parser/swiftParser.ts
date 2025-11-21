import Parser from 'tree-sitter';
// @ts-ignore - tree-sitter-swift doesn't have TypeScript definitions
import Swift from 'tree-sitter-swift';
import { ViewNode, Modifier } from './viewTree';

// Singleton parser instance
let parser: Parser | null = null;

function getParser(): Parser {
    if (!parser) {
        parser = new Parser();
        parser.setLanguage(Swift);
    }
    return parser;
}

/**
 * Parses Swift source code and extracts a ViewNode tree from SwiftUI View structs
 * Returns null if parsing fails or no valid View body is found
 */
export function parseSwiftToViewTree(source: string): ViewNode | null {
    try {
        const tree = getParser().parse(source);
        const root = tree.rootNode;

        // Find a struct that conforms to View
        const viewStruct = findViewStruct(root);
        if (!viewStruct) {
            return null;
        }

        // Find the body property
        const bodyProperty = findBodyProperty(viewStruct);
        if (!bodyProperty) {
            return null;
        }

        // Extract the main expression from body
        const bodyExpression = findBodyExpression(bodyProperty);
        if (!bodyExpression) {
            return null;
        }

        // Convert to ViewNode
        return parseViewExpression(bodyExpression, source);
    } catch (error) {
        console.error('Failed to parse Swift code:', error);
        return null;
    }
}

/**
 * Find a struct declaration that conforms to View protocol
 */
function findViewStruct(node: Parser.SyntaxNode): Parser.SyntaxNode | null {
    if (node.type === 'class_declaration' || node.type === 'struct_declaration') {
        // Check if it has "View" in type inheritance
        const inheritanceClause = node.children.find(c => c.type === 'type_inheritance_clause');
        if (inheritanceClause) {
            const text = inheritanceClause.text;
            if (text.includes('View')) {
                return node;
            }
        }
    }

    // Recursively search children
    for (const child of node.children) {
        const result = findViewStruct(child);
        if (result) {
            return result;
        }
    }

    return null;
}

/**
 * Find the body property in a View struct
 */
function findBodyProperty(structNode: Parser.SyntaxNode): Parser.SyntaxNode | null {
    // Look for computed_property or variable_declaration named "body"
    for (const child of structNode.children) {
        if (child.type === 'computed_property' || child.type === 'variable_declaration') {
            const nameNode = child.children.find(c => c.type === 'simple_identifier' || c.type === 'pattern');
            if (nameNode && nameNode.text === 'body') {
                return child;
            }
        }
    }
    return null;
}

/**
 * Extract the main expression from the body property
 */
function findBodyExpression(bodyNode: Parser.SyntaxNode): Parser.SyntaxNode | null {
    // Look for getter or direct expression
    for (const child of bodyNode.children) {
        if (child.type === 'getter') {
            // Find the return expression or direct statement
            for (const getterChild of child.children) {
                if (getterChild.type === 'statements') {
                    // Get first statement
                    const statement = getterChild.children.find(c => c.type !== '{' && c.type !== '}');
                    if (statement) {
                        return statement;
                    }
                }
            }
        }
    }
    return null;
}

/**
 * Parse a SwiftUI view expression into a ViewNode
 */
function parseViewExpression(node: Parser.SyntaxNode, source: string): ViewNode | null {
    // Handle call_expression (e.g., VStack { ... })
    if (node.type === 'call_expression') {
        return parseCallExpression(node, source);
    }

    // Handle postfix_expression (e.g., VStack { ... }.padding())
    if (node.type === 'postfix_expression') {
        return parsePostfixExpression(node, source);
    }

    // Handle simple identifier
    if (node.type === 'simple_identifier') {
        const name = node.text;
        if (name === 'Spacer') {
            return {
                kind: 'Spacer',
                props: {},
                modifiers: [],
                children: []
            };
        }
    }

    return null;
}

/**
 * Parse a call expression (e.g., VStack { ... }, Text("Hello"))
 */
function parseCallExpression(node: Parser.SyntaxNode, source: string): ViewNode | null {
    const functionNode = node.children.find(c => c.type === 'simple_identifier' || c.type === 'navigation_expression');
    const functionName = functionNode?.text || '';
    
    // Handle container views: VStack, HStack, ZStack
    if (functionName === 'VStack' || functionName === 'HStack' || functionName === 'ZStack') {
        const kind = functionName as "VStack" | "HStack" | "ZStack";
        const props: Record<string, any> = {};
        const children: ViewNode[] = [];

        // Look for closure argument with children
        const args = node.children.find(c => c.type === 'call_suffix' || c.type === 'lambda_literal');
        if (args) {
            // Find closure/trailing closure
            for (const arg of args.children) {
                if (arg.type === 'lambda_literal' || arg.type === 'closure_expression') {
                    const statements = findStatementsInClosure(arg);
                    for (const stmt of statements) {
                        const child = parseViewExpression(stmt, source);
                        if (child) {
                            children.push(child);
                        }
                    }
                }
            }
        }

        return {
            kind,
            props,
            modifiers: [],
            children
        };
    }

    // Handle Text("...")
    if (functionName === 'Text') {
        const args = node.children.find(c => c.type === 'call_suffix');
        let text = '';
        
        if (args) {
            // Find string literal
            for (const arg of args.children) {
                if (arg.type === 'line_string_literal' || arg.type === 'string_literal') {
                    // Extract text without quotes
                    text = arg.text.replace(/^"/, '').replace(/"$/, '');
                    break;
                }
            }
        }

        return {
            kind: 'Text',
            props: { text },
            modifiers: [],
            children: []
        };
    }

    // Handle Image("...")
    if (functionName === 'Image') {
        const args = node.children.find(c => c.type === 'call_suffix');
        let name = '';
        
        if (args) {
            for (const arg of args.children) {
                if (arg.type === 'line_string_literal' || arg.type === 'string_literal') {
                    name = arg.text.replace(/^"/, '').replace(/"$/, '');
                    break;
                }
            }
        }

        return {
            kind: 'Image',
            props: { name },
            modifiers: [],
            children: []
        };
    }

    return null;
}

/**
 * Parse postfix expression (handles modifiers like .padding())
 */
function parsePostfixExpression(node: Parser.SyntaxNode, source: string): ViewNode | null {
    // Find the base expression
    const baseExpr = node.children.find(c => 
        c.type === 'call_expression' || 
        c.type === 'postfix_expression' ||
        c.type === 'simple_identifier'
    );
    
    if (!baseExpr) {
        return null;
    }

    // Parse the base expression first
    const viewNode = parseViewExpression(baseExpr, source);
    if (!viewNode) {
        return null;
    }

    // Collect modifiers
    const modifiers: Modifier[] = [];
    
    for (const child of node.children) {
        if (child.type === 'call_suffix') {
            // This is a modifier like .padding()
            const modifierName = extractModifierName(child);
            if (modifierName) {
                modifiers.push({
                    name: modifierName,
                    args: {}
                });
            }
        }
    }

    // Merge modifiers with the view node
    viewNode.modifiers = [...viewNode.modifiers, ...modifiers];
    
    return viewNode;
}

/**
 * Extract modifier name from call suffix
 */
function extractModifierName(node: Parser.SyntaxNode): string | null {
    // Look for navigation_suffix or simple identifier
    for (const child of node.children) {
        if (child.type === 'navigation_suffix') {
            const identifier = child.children.find(c => c.type === 'simple_identifier');
            if (identifier) {
                return identifier.text;
            }
        }
    }
    
    // Sometimes it's directly a function call
    const text = node.text;
    const match = text.match(/\.(\w+)/);
    if (match) {
        return match[1];
    }
    
    return null;
}

/**
 * Find statements in a closure
 */
function findStatementsInClosure(closure: Parser.SyntaxNode): Parser.SyntaxNode[] {
    const statements: Parser.SyntaxNode[] = [];
    
    for (const child of closure.children) {
        if (child.type === 'statements') {
            // Get all statement children
            for (const stmt of child.children) {
                if (stmt.type !== '{' && stmt.type !== '}' && stmt.text.trim()) {
                    statements.push(stmt);
                }
            }
        }
    }
    
    return statements;
}
