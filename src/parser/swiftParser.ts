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

export interface ParseResult {
    root: ViewNode | null;
    errors: string[];
}

/**
 * Parses Swift source code and extracts a ViewNode tree from SwiftUI View structs
 * Returns { root, errors } where root is null if parsing fails
 */
export function parseSwiftToViewTree(source: string): ParseResult {
    const errors: string[] = [];
    
    try {
        const tree = getParser().parse(source);
        const root = tree.rootNode;

        // Find a struct that conforms to View
        const viewStruct = findViewStruct(root);
        if (!viewStruct) {
            errors.push('No struct conforming to View protocol found');
            return { root: null, errors };
        }

        // Find the body property
        const bodyProperty = findBodyProperty(viewStruct);
        if (!bodyProperty) {
            errors.push('No "var body: some View" property found in View struct');
            return { root: null, errors };
        }

        // Extract the main expression from body
        const bodyExpression = findBodyExpression(bodyProperty);
        if (!bodyExpression) {
            errors.push('Could not extract expression from body property');
            return { root: null, errors };
        }

        // Convert to ViewNode
        const viewNode = parseViewExpression(bodyExpression, source);
        if (!viewNode) {
            errors.push('Body expression is not a supported SwiftUI view (expected VStack with Text children)');
            return { root: null, errors };
        }

        return { root: viewNode, errors };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`Parser exception: ${errorMsg}`);
        console.error('Failed to parse Swift code:', error);
        return { root: null, errors };
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

    // Collect modifiers from postfix expressions
    const modifiers: Modifier[] = [];
    
    for (const child of node.children) {
        if (child.type === 'call_suffix') {
            // This is a modifier like .padding() or .foregroundColor(.red)
            const modifier = parseModifier(child);
            if (modifier) {
                modifiers.push(modifier);
            }
        }
    }

    // Merge modifiers with the view node
    viewNode.modifiers = [...viewNode.modifiers, ...modifiers];
    
    return viewNode;
}

/**
 * Parse a modifier call (e.g., .padding(16), .foregroundColor(.red))
 */
function parseModifier(callSuffix: Parser.SyntaxNode): Modifier | null {
    // Find the modifier name from navigation_suffix
    let modifierName: string | null = null;
    
    for (const child of callSuffix.children) {
        if (child.type === 'navigation_suffix') {
            const identifier = child.children.find(c => c.type === 'simple_identifier');
            if (identifier) {
                modifierName = identifier.text;
                break;
            }
        }
    }
    
    if (!modifierName) {
        return null;
    }
    
    // Parse arguments
    const args: Record<string, any> = {};
    
    // Find argument list
    const argList = callSuffix.children.find(c => 
        c.type === 'value_arguments' || 
        c.type === 'argument_list' ||
        c.type === 'tuple_expression'
    );
    
    if (argList) {
        const argNodes = argList.children.filter(c => 
            c.type === 'value_argument' || 
            c.type === 'simple_identifier' ||
            c.type === 'integer_literal' ||
            c.type === 'navigation_expression' ||
            c.type === 'call_expression'
        );
        
        for (const arg of argNodes) {
            parseModifierArgument(arg, args, modifierName);
        }
    }
    
    return {
        name: modifierName,
        args
    };
}

/**
 * Parse a single modifier argument and add to args object
 */
function parseModifierArgument(node: Parser.SyntaxNode, args: Record<string, any>, modifierName: string) {
    // Handle labeled arguments like width: 200
    if (node.type === 'value_argument') {
        const label = node.children.find(c => c.type === 'value_argument_label');
        const value = node.children.find(c => 
            c.type === 'integer_literal' || 
            c.type === 'float_literal' ||
            c.type === 'navigation_expression' ||
            c.type === 'call_expression'
        );
        
        if (label && value) {
            const labelText = label.text.replace(':', '');
            if (value.type === 'integer_literal' || value.type === 'float_literal') {
                args[labelText] = parseFloat(value.text);
            } else if (value.type === 'navigation_expression' || value.type === 'call_expression') {
                // Extract color/enum value
                const colorName = extractEnumValue(value);
                if (colorName) {
                    args[labelText] = colorName;
                }
            }
        }
    }
    // Handle unlabeled arguments
    else if (node.type === 'integer_literal' || node.type === 'float_literal') {
        // Unlabeled numeric argument (e.g., padding(16), cornerRadius(12))
        const value = parseFloat(node.text);
        if (modifierName === 'padding') {
            args.all = value;
        } else if (modifierName === 'cornerRadius') {
            args.radius = value;
        }
    }
    // Handle enum-style arguments like .red, .title
    else if (node.type === 'navigation_expression') {
        const enumValue = extractEnumValue(node);
        if (enumValue) {
            if (modifierName === 'foregroundColor') {
                args.color = enumValue;
            } else if (modifierName === 'font') {
                args.style = enumValue;
            }
        }
    }
    // Handle Color.blue style
    else if (node.type === 'call_expression') {
        const typeName = node.children.find(c => c.type === 'simple_identifier' || c.type === 'navigation_expression');
        if (typeName && typeName.text === 'Color') {
            // Look for Color.xxx pattern
            const colorExpr = node.children.find(c => c.type === 'navigation_expression');
            if (colorExpr) {
                const colorName = extractEnumValue(colorExpr);
                if (colorName && modifierName === 'background') {
                    args.color = colorName;
                }
            }
        } else {
            // Try to extract from the whole expression
            const colorName = extractEnumValue(node);
            if (colorName && modifierName === 'background') {
                args.color = colorName;
            }
        }
    }
}

/**
 * Extract enum value from expressions like .red, .title, Color.blue
 */
function extractEnumValue(node: Parser.SyntaxNode): string | null {
    const text = node.text;
    
    // Handle .red, .title patterns
    if (text.startsWith('.')) {
        return text.substring(1);
    }
    
    // Handle Color.red patterns
    const match = text.match(/Color\.(\w+)/);
    if (match) {
        return match[1];
    }
    
    // Try to find the last identifier in navigation
    const identifiers = node.children.filter(c => c.type === 'simple_identifier');
    if (identifiers.length > 0) {
        return identifiers[identifiers.length - 1].text;
    }
    
    return null;
}

/**
 * Extract modifier name from call suffix (legacy helper)
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
