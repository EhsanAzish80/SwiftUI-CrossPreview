import { ViewNode, Modifier } from './viewTree';

// Try to load tree-sitter, but provide fallback if native modules fail
let Parser: any = null;
let Swift: any = null;
let useTreeSitter = true;

try {
    Parser = require('tree-sitter');
    Swift = require('tree-sitter-swift');
} catch (error) {
    console.warn('Tree-sitter native modules not available, using regex fallback parser:', error);
    useTreeSitter = false;
}

// Singleton parser instance
let parser: any = null;

function getParser(): any {
    if (!parser && useTreeSitter && Parser && Swift) {
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
    
    // Use tree-sitter if available, otherwise use regex fallback
    if (useTreeSitter && parser) {
        return parseWithTreeSitter(source);
    } else {
        return parseWithRegex(source);
    }
}

/**
 * Parse using tree-sitter (preferred method)
 */
function parseWithTreeSitter(source: string): ParseResult {
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
function findViewStruct(node: any): any {
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
function findBodyProperty(structNode: any): any {
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
function findBodyExpression(bodyNode: any): any {
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
function parseViewExpression(node: any, source: string): ViewNode | null {
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
function parseCallExpression(node: any, source: string): ViewNode | null {
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
            // Parse alignment and spacing from value_arguments
            const valueArgs = args.children.filter(c => c.type === 'value_argument');
            for (const valueArg of valueArgs) {
                const label = valueArg.children.find(c => c.type === 'value_argument_label');
                const value = valueArg.children.find(c => 
                    c.type === 'navigation_expression' || 
                    c.type === 'integer_literal' ||
                    c.type === 'float_literal'
                );
                
                if (label && value) {
                    const labelText = label.text.replace(':', '');
                    if (labelText === 'alignment') {
                        const alignValue = extractEnumValue(value);
                        if (alignValue) {
                            props.alignment = alignValue;
                        }
                    } else if (labelText === 'spacing') {
                        if (value.type === 'integer_literal' || value.type === 'float_literal') {
                            props.spacing = parseFloat(value.text);
                        }
                    }
                }
            }
            
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
function parsePostfixExpression(node: any, source: string): ViewNode | null {
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
function parseModifier(callSuffix: any): Modifier | null {
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
function parseModifierArgument(node: any, args: Record<string, any>, modifierName: string) {
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
        // Unlabeled numeric argument (e.g., padding(16), cornerRadius(12), opacity(0.5))
        const value = parseFloat(node.text);
        if (modifierName === 'padding') {
            args.all = value;
        } else if (modifierName === 'cornerRadius') {
            args.radius = value;
        } else if (modifierName === 'shadow') {
            args.radius = value;
        } else if (modifierName === 'opacity') {
            args.value = value;
        } else if (modifierName === 'lineLimit') {
            args.lines = Math.floor(value);
        }
    }
    // Handle enum-style arguments like .red, .title, .center, .ultraThinMaterial
    else if (node.type === 'navigation_expression') {
        const enumValue = extractEnumValue(node);
        if (enumValue) {
            if (modifierName === 'foregroundColor') {
                args.color = enumValue;
            } else if (modifierName === 'font') {
                args.style = enumValue;
            } else if (modifierName === 'multilineTextAlignment') {
                args.alignment = enumValue;
            } else if (modifierName === 'background') {
                // Check if it's a material
                if (enumValue.includes('Material') || enumValue === 'ultraThin' || enumValue === 'thin' || enumValue === 'regular') {
                    const materialKind = enumValue.replace('Material', '');
                    args.material = materialKind.charAt(0).toLowerCase() + materialKind.slice(1) || enumValue;
                } else {
                    args.color = enumValue;
                }
            }
        }
    }
    // Handle Color.blue style and overlay content
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
        } else if (modifierName === 'overlay') {
            // Parse overlay content as a ViewNode
            const overlayNode = parseViewExpression(node, '');
            if (overlayNode) {
                args.content = overlayNode;
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
function extractEnumValue(node: any): string | null {
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
function extractModifierName(node: any): string | null {
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
function findStatementsInClosure(closure: any): any[] {
    const statements: any[] = [];
    
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

/**
 * Simple regex-based fallback parser when tree-sitter is not available
 * This provides basic parsing support but won't handle complex Swift syntax
 */
function parseWithRegex(source: string): ParseResult {
    const errors: string[] = [];
    
    try {
        // Find body property content - handle nested braces
        const bodyStart = source.indexOf('var body');
        if (bodyStart === -1) {
            errors.push('Could not find "var body" property');
            return { root: null, errors };
        }
        
        // Find the opening brace after "some View"
        const viewIndex = source.indexOf('some View', bodyStart);
        const openBraceIndex = source.indexOf('{', viewIndex);
        
        if (openBraceIndex === -1) {
            errors.push('Could not find opening brace for body');
            return { root: null, errors };
        }
        
        // Find matching closing brace
        let braceCount = 1;
        let closeBraceIndex = openBraceIndex + 1;
        
        while (braceCount > 0 && closeBraceIndex < source.length) {
            if (source[closeBraceIndex] === '{') braceCount++;
            if (source[closeBraceIndex] === '}') braceCount--;
            closeBraceIndex++;
        }
        
        const bodyContent = source.substring(openBraceIndex + 1, closeBraceIndex - 1).trim();
        
        // Parse the main view (VStack, HStack, etc.)
        const root = parseRegexView(bodyContent);
        
        if (!root) {
            errors.push('Could not parse body content (regex fallback mode - try using native tree-sitter by building on your platform)');
            return { root: null, errors };
        }
        
        return { root, errors };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`Parser exception (regex fallback): ${errorMsg}`);
        return { root: null, errors };
    }
}

function parseRegexView(content: string): ViewNode | null {
    content = content.trim();
    
    // Match VStack/HStack/ZStack with their content
    const stackMatch = content.match(/^(VStack|HStack|ZStack)\s*\{/);
    if (stackMatch) {
        const kind = stackMatch[1] as "VStack" | "HStack" | "ZStack";
        
        // Find the matching closing brace for this stack
        let braceCount = 1;
        let i = stackMatch[0].length;
        
        while (braceCount > 0 && i < content.length) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') braceCount--;
            i++;
        }
        
        const innerContent = content.substring(stackMatch[0].length, i - 1).trim();
        const children: ViewNode[] = [];
        
        // Parse Text views with modifiers
        let pos = 0;
        while (pos < innerContent.length) {
            const textMatch = innerContent.substring(pos).match(/Text\("([^"]+)"\)/);
            if (textMatch && textMatch.index !== undefined) {
                const text = textMatch[1];
                const textStart = pos + textMatch.index;
                const textEnd = textStart + textMatch[0].length;
                
                // Look for modifiers after this Text
                let currentPos = textEnd;
                const modifiers: Modifier[] = [];
                
                while (currentPos < innerContent.length) {
                    const remaining = innerContent.substring(currentPos);
                    
                    // Check if next non-whitespace is a dot (modifier)
                    const nextContent = remaining.trim();
                    if (!nextContent.startsWith('.')) {
                        break;
                    }
                    
                    // Parse modifier
                    const modMatch = nextContent.match(/^\.(\w+)\(([^)]*)\)/);
                    if (modMatch) {
                        const modName = modMatch[1];
                        const modArgs = modMatch[2];
                        
                        // Parse modifier arguments
                        const args: Record<string, any> = {};
                        
                        if (modName === 'padding' && modArgs) {
                            const num = parseFloat(modArgs);
                            if (!isNaN(num)) args.all = num;
                        } else if (modName === 'font' && modArgs) {
                            const fontMatch = modArgs.match(/\.(\w+)/);
                            if (fontMatch) args.style = fontMatch[1];
                        } else if (modName === 'foregroundColor' && modArgs) {
                            const colorMatch = modArgs.match(/\.(\w+)/);
                            if (colorMatch) args.color = colorMatch[1];
                        } else if (modName === 'background' && modArgs) {
                            // Check for material or color
                            const materialMatch = modArgs.match(/\.(ultraThin|thin|regular)Material/);
                            const colorMatch = modArgs.match(/Color\.(\w+)/);
                            if (materialMatch) {
                                args.material = materialMatch[1];
                            } else if (colorMatch) {
                                args.color = colorMatch[1];
                            }
                        } else if (modName === 'cornerRadius' && modArgs) {
                            const num = parseFloat(modArgs);
                            if (!isNaN(num)) args.radius = num;
                        } else if (modName === 'shadow' && modArgs) {
                            const radiusMatch = modArgs.match(/radius:\s*([\d.]+)/);
                            if (radiusMatch) {
                                args.radius = parseFloat(radiusMatch[1]);
                            } else if (modArgs === '') {
                                args.radius = 8; // default
                            }
                        } else if (modName === 'opacity' && modArgs) {
                            const num = parseFloat(modArgs);
                            if (!isNaN(num)) args.value = num;
                        } else if (modName === 'blur' && modArgs) {
                            const radiusMatch = modArgs.match(/radius:\s*([\d.]+)/);
                            if (radiusMatch) {
                                args.radius = parseFloat(radiusMatch[1]);
                            }
                        } else if (modName === 'multilineTextAlignment' && modArgs) {
                            const alignMatch = modArgs.match(/\.(\w+)/);
                            if (alignMatch) args.alignment = alignMatch[1];
                        } else if (modName === 'lineLimit' && modArgs) {
                            const num = parseInt(modArgs);
                            if (!isNaN(num)) args.lines = num;
                        } else if (modName === 'frame' && modArgs) {
                            const widthMatch = modArgs.match(/width:\s*(\d+)/);
                            const heightMatch = modArgs.match(/height:\s*(\d+)/);
                            if (widthMatch) args.width = parseInt(widthMatch[1]);
                            if (heightMatch) args.height = parseInt(heightMatch[1]);
                        }
                        
                        modifiers.push({ name: modName, args });
                        currentPos += remaining.indexOf(modMatch[0]) + modMatch[0].length;
                    } else {
                        break;
                    }
                }
                
                children.push({
                    kind: 'Text',
                    props: { text },
                    modifiers,
                    children: []
                });
                
                pos = currentPos;
            } else {
                pos++;
            }
        }
        
        // Parse modifiers on the VStack itself
        const stackModifiers: Modifier[] = [];
        const stackProps: Record<string, any> = {};
        
        // Try to parse VStack parameters (alignment, spacing)
        const stackParamsMatch = content.match(/^(VStack|HStack|ZStack)\s*\(([^)]*)\)/);
        if (stackParamsMatch) {
            const params = stackParamsMatch[2];
            const alignmentMatch = params.match(/alignment:\s*\.(\w+)/);
            const spacingMatch = params.match(/spacing:\s*([\d.]+)/);
            if (alignmentMatch) stackProps.alignment = alignmentMatch[1];
            if (spacingMatch) stackProps.spacing = parseFloat(spacingMatch[1]);
        }
        
        let afterStack = content.substring(i);
        
        while (afterStack.trim().startsWith('.')) {
            const modMatch = afterStack.trim().match(/^\.(\w+)\(([^)]*)\)/);
            if (modMatch) {
                const modName = modMatch[1];
                const modArgs = modMatch[2];
                const args: Record<string, any> = {};
                
                if (modName === 'padding' && modArgs) {
                    const num = parseFloat(modArgs);
                    if (!isNaN(num)) args.all = num;
                    else if (!modArgs) args.all = 16; // Default padding
                } else if (modName === 'frame' && modArgs) {
                    const widthMatch = modArgs.match(/width:\s*(\d+)/);
                    const heightMatch = modArgs.match(/height:\s*(\d+)/);
                    if (widthMatch) args.width = parseInt(widthMatch[1]);
                    if (heightMatch) args.height = parseInt(heightMatch[1]);
                } else if (modName === 'shadow' && modArgs) {
                    const radiusMatch = modArgs.match(/radius:\s*([\d.]+)/);
                    if (radiusMatch) {
                        args.radius = parseFloat(radiusMatch[1]);
                    } else if (modArgs === '') {
                        args.radius = 8;
                    }
                } else if (modName === 'cornerRadius' && modArgs) {
                    const num = parseFloat(modArgs);
                    if (!isNaN(num)) args.radius = num;
                } else if (modName === 'opacity' && modArgs) {
                    const num = parseFloat(modArgs);
                    if (!isNaN(num)) args.value = num;
                } else if (modName === 'blur' && modArgs) {
                    const radiusMatch = modArgs.match(/radius:\s*([\d.]+)/);
                    if (radiusMatch) args.radius = parseFloat(radiusMatch[1]);
                } else if (modName === 'background' && modArgs) {
                    const materialMatch = modArgs.match(/\.(ultraThin|thin|regular)Material/);
                    const colorMatch = modArgs.match(/Color\.(\w+)/);
                    if (materialMatch) {
                        args.material = materialMatch[1];
                    } else if (colorMatch) {
                        args.color = colorMatch[1];
                    }
                }
                
                stackModifiers.push({ name: modName, args });
                afterStack = afterStack.substring(afterStack.indexOf(modMatch[0]) + modMatch[0].length);
            } else {
                break;
            }
        }
        
        return {
            kind,
            props: stackProps,
            modifiers: stackModifiers,
            children
        };
    }
    
    // Match simple Text
    const textMatch = content.match(/^Text\("([^"]+)"\)/);
    if (textMatch) {
        return {
            kind: 'Text',
            props: { text: textMatch[1] },
            modifiers: [],
            children: []
        };
    }
    
    return null;
}
