import { ViewNode, Modifier } from './viewTree';

/**
 * Simple regex-based parser for SwiftUI views
 * This is a minimal implementation that handles basic SwiftUI structures
 */
export function parseSwiftUI(swiftCode: string): ViewNode | null {
    // Find the body property of a View struct
    const bodyMatch = swiftCode.match(/var\s+body\s*:\s*some\s+View\s*\{([\s\S]*)\}/);
    
    if (!bodyMatch) {
        return null;
    }
    
    const bodyContent = bodyMatch[1].trim();
    return parseViewExpression(bodyContent);
}

function parseViewExpression(code: string): ViewNode | null {
    code = code.trim();
    
    // Parse VStack
    if (code.startsWith('VStack')) {
        return parseStack(code, 'VStack');
    }
    
    // Parse HStack
    if (code.startsWith('HStack')) {
        return parseStack(code, 'HStack');
    }
    
    // Parse ZStack
    if (code.startsWith('ZStack')) {
        return parseStack(code, 'ZStack');
    }
    
    // Parse Text
    if (code.startsWith('Text')) {
        return parseText(code);
    }
    
    // Parse Image
    if (code.startsWith('Image')) {
        return parseImage(code);
    }
    
    // Parse Spacer
    if (code.startsWith('Spacer')) {
        return {
            kind: 'Spacer',
            props: {},
            modifiers: [],
            children: []
        };
    }
    
    return null;
}

function parseStack(code: string, kind: 'VStack' | 'HStack' | 'ZStack'): ViewNode {
    const node: ViewNode = {
        kind,
        props: {},
        modifiers: [],
        children: []
    };
    
    // Extract parameters (e.g., spacing: 12)
    const paramsMatch = code.match(/\((.*?)\)\s*\{/);
    if (paramsMatch && paramsMatch[1]) {
        const params = paramsMatch[1];
        const spacingMatch = params.match(/spacing:\s*(\d+)/);
        if (spacingMatch) {
            node.props.spacing = parseInt(spacingMatch[1]);
        }
    }
    
    // Extract content between braces
    const contentMatch = code.match(/\{([\s\S]*)\}$/);
    if (!contentMatch) {
        return node;
    }
    
    let content = contentMatch[1].trim();
    
    // Extract modifiers from the end
    const { cleanContent, modifiers } = extractModifiers(content);
    node.modifiers = modifiers;
    content = cleanContent;
    
    // Parse children
    node.children = parseChildren(content);
    
    return node;
}

function parseText(code: string): ViewNode {
    const node: ViewNode = {
        kind: 'Text',
        props: {},
        modifiers: [],
        children: []
    };
    
    // Extract text content
    const textMatch = code.match(/Text\s*\(\s*"([^"]*)"\s*\)/);
    if (textMatch) {
        node.props.text = textMatch[1];
    }
    
    // Extract modifiers
    const { modifiers } = extractModifiers(code);
    node.modifiers = modifiers;
    
    return node;
}

function parseImage(code: string): ViewNode {
    const node: ViewNode = {
        kind: 'Image',
        props: {},
        modifiers: [],
        children: []
    };
    
    // Extract image name or systemName
    const systemNameMatch = code.match(/Image\s*\(\s*systemName:\s*"([^"]*)"\s*\)/);
    const nameMatch = code.match(/Image\s*\(\s*"([^"]*)"\s*\)/);
    
    if (systemNameMatch) {
        node.props.systemName = systemNameMatch[1];
    } else if (nameMatch) {
        node.props.name = nameMatch[1];
    }
    
    // Extract modifiers
    const { modifiers } = extractModifiers(code);
    node.modifiers = modifiers;
    
    return node;
}

function parseChildren(content: string): ViewNode[] {
    const children: ViewNode[] = [];
    
    // Split by view boundaries - this is a simple heuristic
    const lines = content.split('\n');
    let currentView = '';
    let braceDepth = 0;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine || trimmedLine === '}') {
            continue;
        }
        
        // Count braces
        for (const char of line) {
            if (char === '{') braceDepth++;
            if (char === '}') braceDepth--;
        }
        
        currentView += line + '\n';
        
        // If we're back at depth 0 and have content, parse it
        if (braceDepth === 0 && currentView.trim()) {
            const viewCode = currentView.trim();
            const childNode = parseViewExpression(viewCode);
            if (childNode) {
                children.push(childNode);
            }
            currentView = '';
        }
    }
    
    // Handle remaining content
    if (currentView.trim()) {
        const childNode = parseViewExpression(currentView.trim());
        if (childNode) {
            children.push(childNode);
        }
    }
    
    return children;
}

function extractModifiers(code: string): { cleanContent: string; modifiers: Modifier[] } {
    const modifiers: Modifier[] = [];
    let cleanContent = code;
    
    // Extract .padding()
    const paddingMatches = code.matchAll(/\.padding\s*\((\d*)\)/g);
    for (const match of paddingMatches) {
        modifiers.push({
            name: 'padding',
            args: match[1] ? { value: parseInt(match[1]) } : {}
        });
    }
    
    // Extract .foregroundColor(.color)
    const fgColorMatches = code.matchAll(/\.foregroundColor\s*\(\s*\.(\w+)\s*\)/g);
    for (const match of fgColorMatches) {
        modifiers.push({
            name: 'foregroundColor',
            args: { color: match[1] }
        });
    }
    
    // Extract .background(Color.color)
    const bgColorMatches = code.matchAll(/\.background\s*\(\s*Color\.(\w+)\s*\)/g);
    for (const match of bgColorMatches) {
        modifiers.push({
            name: 'background',
            args: { color: match[1] }
        });
    }
    
    // Extract .font(.style)
    const fontMatches = code.matchAll(/\.font\s*\(\s*\.(\w+)\s*\)/g);
    for (const match of fontMatches) {
        modifiers.push({
            name: 'font',
            args: { style: match[1] }
        });
    }
    
    // Extract .frame
    const frameMatches = code.matchAll(/\.frame\s*\((.*?)\)/g);
    for (const match of frameMatches) {
        const args: Record<string, any> = {};
        const params = match[1];
        
        const widthMatch = params.match(/width:\s*(\d+)/);
        if (widthMatch) args.width = parseInt(widthMatch[1]);
        
        const heightMatch = params.match(/height:\s*(\d+)/);
        if (heightMatch) args.height = parseInt(heightMatch[1]);
        
        modifiers.push({
            name: 'frame',
            args
        });
    }
    
    // Extract .cornerRadius
    const cornerMatches = code.matchAll(/\.cornerRadius\s*\((\d+)\)/g);
    for (const match of cornerMatches) {
        modifiers.push({
            name: 'cornerRadius',
            args: { radius: parseInt(match[1]) }
        });
    }
    
    // Remove modifiers from content for cleaner parsing
    if (modifiers.length > 0) {
        // Find the first modifier position
        const modifierPattern = /\.(padding|foregroundColor|background|font|frame|cornerRadius)\s*\(/;
        const firstModifier = code.search(modifierPattern);
        if (firstModifier !== -1) {
            cleanContent = code.substring(0, firstModifier).trim();
        }
    }
    
    return { cleanContent, modifiers };
}
