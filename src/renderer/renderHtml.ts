import { ViewNode, Modifier } from '../parser/viewTree';

/**
 * Renders a ViewNode tree to HTML
 */
export function renderToHtml(root: ViewNode): string {
    return `<div class="root">${renderNode(root)}</div>`;
}

/**
 * Renders an error banner for parse failures
 */
export function renderErrorBanner(errors: string[]): string {
    const errorItems = errors.map(err => `<li>${escapeHtml(err)}</li>`).join('');
    return `<div class="error-banner">
        <strong>Failed to parse SwiftUI body:</strong>
        <ul>${errorItems}</ul>
    </div>`;
}

/**
 * Build inline CSS style from modifiers
 */
function buildStyle(node: ViewNode): string {
    if (!node.modifiers || node.modifiers.length === 0) {
        return '';
    }
    
    const styles: string[] = [];
    
    for (const modifier of node.modifiers) {
        switch (modifier.name) {
            case 'padding':
                if (modifier.args.all !== undefined) {
                    styles.push(`padding: ${modifier.args.all}px`);
                } else {
                    styles.push('padding: 8px');
                }
                break;
                
            case 'foregroundColor':
                if (modifier.args.color) {
                    const cssColor = swiftColorToCss(modifier.args.color);
                    styles.push(`color: ${cssColor}`);
                }
                break;
                
            case 'background':
                if (modifier.args.color) {
                    const cssColor = swiftColorToCss(modifier.args.color);
                    styles.push(`background-color: ${cssColor}`);
                }
                break;
                
            case 'font':
                if (modifier.args.style) {
                    const { fontSize, fontWeight } = swiftFontStyleToCss(modifier.args.style);
                    styles.push(`font-size: ${fontSize}`);
                    styles.push(`font-weight: ${fontWeight}`);
                }
                break;
                
            case 'frame':
                if (modifier.args.width !== undefined) {
                    styles.push(`width: ${modifier.args.width}px`);
                }
                if (modifier.args.height !== undefined) {
                    styles.push(`height: ${modifier.args.height}px`);
                }
                break;
                
            case 'cornerRadius':
                if (modifier.args.radius !== undefined) {
                    styles.push(`border-radius: ${modifier.args.radius}px`);
                }
                break;
        }
    }
    
    return styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
}

/**
 * Map Swift color names to CSS colors
 */
function swiftColorToCss(swiftColor: string): string {
    const colorMap: Record<string, string> = {
        'red': '#ff3b30',
        'orange': '#ff9500',
        'yellow': '#ffcc00',
        'green': '#34c759',
        'mint': '#00c7be',
        'teal': '#30b0c7',
        'cyan': '#32ade6',
        'blue': '#007aff',
        'indigo': '#5856d6',
        'purple': '#af52de',
        'pink': '#ff2d55',
        'brown': '#a2845e',
        'white': '#ffffff',
        'gray': '#8e8e93',
        'black': '#000000',
        'clear': 'transparent'
    };
    
    return colorMap[swiftColor.toLowerCase()] || swiftColor;
}

/**
 * Map Swift font styles to CSS font properties
 */
function swiftFontStyleToCss(style: string): { fontSize: string; fontWeight: string } {
    const fontMap: Record<string, { fontSize: string; fontWeight: string }> = {
        'largeTitle': { fontSize: '28px', fontWeight: 'bold' },
        'title': { fontSize: '22px', fontWeight: 'bold' },
        'title2': { fontSize: '20px', fontWeight: 'bold' },
        'title3': { fontSize: '18px', fontWeight: 'semibold' },
        'headline': { fontSize: '14px', fontWeight: 'semibold' },
        'body': { fontSize: '14px', fontWeight: 'normal' },
        'callout': { fontSize: '13px', fontWeight: 'normal' },
        'subheadline': { fontSize: '12px', fontWeight: 'normal' },
        'footnote': { fontSize: '11px', fontWeight: 'normal' },
        'caption': { fontSize: '10px', fontWeight: 'normal' },
        'caption2': { fontSize: '10px', fontWeight: 'normal' }
    };
    
    return fontMap[style] || { fontSize: '14px', fontWeight: 'normal' };
}

function renderNode(node: ViewNode): string {
    const style = buildStyle(node);
    
    switch (node.kind) {
        case 'VStack':
            return `<div class="vstack"${style}>${node.children.map(renderNode).join('')}</div>`;
        case 'HStack':
            return `<div class="hstack"${style}>${node.children.map(renderNode).join('')}</div>`;
        case 'Text':
            return `<div class="text"${style}>${escapeHtml(node.props.text ?? '')}</div>`;
        case 'Image':
            return `<div class="image-placeholder"${style}>${escapeHtml(node.props.name ?? 'Image')}</div>`;
        case 'Spacer':
            return `<div class="spacer"${style}></div>`;
        default:
            return `<div class="custom"${style}>${escapeHtml(node.kind)}</div>`;
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
