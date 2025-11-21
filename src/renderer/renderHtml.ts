import { ViewNode } from '../parser/viewTree';

/**
 * Renders a ViewNode tree to HTML
 */
export function renderToHtml(root: ViewNode): string {
    return renderNode(root);
}

function renderNode(node: ViewNode): string {
    const modifierStyles = getModifierStyles(node.modifiers);
    const modifierClasses = getModifierClasses(node.modifiers);
    
    let html = '';
    
    switch (node.kind) {
        case 'VStack':
            html = `<div class="vstack ${modifierClasses}" style="${modifierStyles}">`;
            html += node.children.map(child => renderNode(child)).join('');
            html += '</div>';
            break;
            
        case 'HStack':
            html = `<div class="hstack ${modifierClasses}" style="${modifierStyles}">`;
            html += node.children.map(child => renderNode(child)).join('');
            html += '</div>';
            break;
            
        case 'ZStack':
            html = `<div class="zstack ${modifierClasses}" style="${modifierStyles}">`;
            html += node.children.map(child => renderNode(child)).join('');
            html += '</div>';
            break;
            
        case 'Text':
            const text = node.props.text || '';
            html = `<div class="text ${modifierClasses}" style="${modifierStyles}">${escapeHtml(text)}</div>`;
            break;
            
        case 'Image':
            const imageName = node.props.systemName || node.props.name || 'image';
            html = `<div class="image-placeholder ${modifierClasses}" style="${modifierStyles}">${escapeHtml(imageName)}</div>`;
            break;
            
        case 'Spacer':
            html = `<div class="spacer ${modifierClasses}" style="${modifierStyles}"></div>`;
            break;
            
        default:
            html = `<div class="custom ${modifierClasses}" style="${modifierStyles}">Custom View</div>`;
    }
    
    return html;
}

function getModifierStyles(modifiers: any[]): string {
    const styles: string[] = [];
    
    for (const mod of modifiers) {
        switch (mod.name) {
            case 'padding':
                const padding = mod.args.value || 16;
                styles.push(`padding: ${padding}px`);
                break;
                
            case 'foregroundColor':
                const fgColor = mod.args.color || 'black';
                styles.push(`color: ${mapSwiftUIColor(fgColor)}`);
                break;
                
            case 'background':
                const bgColor = mod.args.color || 'transparent';
                styles.push(`background-color: ${mapSwiftUIColor(bgColor)}`);
                break;
                
            case 'font':
                const fontStyle = mod.args.style || 'body';
                styles.push(mapFontStyle(fontStyle));
                break;
                
            case 'frame':
                if (mod.args.width) {
                    styles.push(`width: ${mod.args.width}px`);
                }
                if (mod.args.height) {
                    styles.push(`height: ${mod.args.height}px`);
                }
                break;
                
            case 'cornerRadius':
                const radius = mod.args.radius || 0;
                styles.push(`border-radius: ${radius}px`);
                break;
        }
    }
    
    return styles.join('; ');
}

function getModifierClasses(modifiers: any[]): string {
    const classes: string[] = [];
    
    for (const mod of modifiers) {
        if (mod.name === 'padding') {
            classes.push('has-padding');
        }
    }
    
    return classes.join(' ');
}

function mapSwiftUIColor(color: string): string {
    const colorMap: Record<string, string> = {
        'red': '#FF3B30',
        'orange': '#FF9500',
        'yellow': '#FFCC00',
        'green': '#34C759',
        'mint': '#00C7BE',
        'teal': '#30B0C7',
        'cyan': '#32ADE6',
        'blue': '#007AFF',
        'indigo': '#5856D6',
        'purple': '#AF52DE',
        'pink': '#FF2D55',
        'brown': '#A2845E',
        'white': '#FFFFFF',
        'gray': '#8E8E93',
        'black': '#000000',
        'clear': 'transparent'
    };
    
    return colorMap[color.toLowerCase()] || color;
}

function mapFontStyle(style: string): string {
    const fontMap: Record<string, string> = {
        'largeTitle': 'font-size: 34px; font-weight: 400',
        'title': 'font-size: 28px; font-weight: 400',
        'title2': 'font-size: 22px; font-weight: 400',
        'title3': 'font-size: 20px; font-weight: 400',
        'headline': 'font-size: 17px; font-weight: 600',
        'body': 'font-size: 17px; font-weight: 400',
        'callout': 'font-size: 16px; font-weight: 400',
        'subheadline': 'font-size: 15px; font-weight: 400',
        'footnote': 'font-size: 13px; font-weight: 400',
        'caption': 'font-size: 12px; font-weight: 400',
        'caption2': 'font-size: 11px; font-weight: 400'
    };
    
    return fontMap[style] || 'font-size: 17px; font-weight: 400';
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
