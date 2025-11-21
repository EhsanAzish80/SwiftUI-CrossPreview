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
    let hasOverlay = false;
    
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
                
            case 'backgroundMaterial':
            case 'material':
                if (modifier.args.material || modifier.args.kind) {
                    const materialKind = modifier.args.material || modifier.args.kind;
                    const materialStyles = getMaterialStyles(materialKind);
                    styles.push(...materialStyles);
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
                
            case 'shadow':
                const radius = modifier.args.radius !== undefined ? modifier.args.radius : 8;
                styles.push(`box-shadow: 0 ${radius / 2}px ${radius * 2}px rgba(0,0,0,0.35)`);
                break;
                
            case 'opacity':
                if (modifier.args.value !== undefined) {
                    styles.push(`opacity: ${modifier.args.value}`);
                }
                break;
                
            case 'blur':
                if (modifier.args.radius !== undefined) {
                    styles.push(`filter: blur(${modifier.args.radius}px)`);
                }
                break;
                
            case 'multilineTextAlignment':
                if (modifier.args.alignment) {
                    const alignment = modifier.args.alignment;
                    if (alignment === 'leading') styles.push('text-align: left');
                    else if (alignment === 'center') styles.push('text-align: center');
                    else if (alignment === 'trailing') styles.push('text-align: right');
                }
                break;
                
            case 'lineLimit':
                if (modifier.args.lines !== undefined) {
                    styles.push('display: -webkit-box');
                    styles.push(`-webkit-line-clamp: ${modifier.args.lines}`);
                    styles.push('-webkit-box-orient: vertical');
                    styles.push('overflow: hidden');
                }
                break;
                
            case 'overlay':
                hasOverlay = true;
                break;
        }
    }
    
    return styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
}

/**
 * Get CSS styles for glass/material backgrounds
 */
function getMaterialStyles(kind: string): string[] {
    const styles: string[] = [];
    
    switch (kind.toLowerCase()) {
        case 'ultrathin':
            styles.push('background-color: rgba(255,255,255,0.08)');
            styles.push('backdrop-filter: blur(18px)');
            styles.push('border: 1px solid rgba(255,255,255,0.18)');
            break;
        case 'thin':
            styles.push('background-color: rgba(255,255,255,0.12)');
            styles.push('backdrop-filter: blur(18px)');
            styles.push('border: 1px solid rgba(255,255,255,0.2)');
            break;
        case 'regular':
            styles.push('background-color: rgba(255,255,255,0.18)');
            styles.push('backdrop-filter: blur(18px)');
            styles.push('border: 1px solid rgba(255,255,255,0.22)');
            break;
        default:
            styles.push('background-color: rgba(255,255,255,0.12)');
            styles.push('backdrop-filter: blur(18px)');
            styles.push('border: 1px solid rgba(255,255,255,0.2)');
    }
    
    return styles;
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
    // Check if node has overlay modifier
    const overlayModifier = node.modifiers?.find(m => m.name === 'overlay');
    
    // Build base element
    let baseHtml = '';
    const style = buildStyle(node);
    
    // Handle stack alignment and spacing in class/style
    let stackClasses = '';
    let stackStyles = '';
    
    switch (node.kind) {
        case 'VStack':
            stackClasses = 'vstack';
            if (node.props.spacing !== undefined) {
                stackStyles += `gap: ${node.props.spacing}px; `;
            }
            if (node.props.alignment) {
                const align = node.props.alignment;
                if (align === 'leading') stackStyles += 'align-items: flex-start; ';
                else if (align === 'center') stackStyles += 'align-items: center; ';
                else if (align === 'trailing') stackStyles += 'align-items: flex-end; ';
            }
            baseHtml = `<div class="${stackClasses}"${stackStyles ? ` style="${stackStyles.trim()}"` : ''}${style}>${node.children.map(renderNode).join('')}</div>`;
            break;
            
        case 'HStack':
            stackClasses = 'hstack';
            if (node.props.spacing !== undefined) {
                stackStyles += `gap: ${node.props.spacing}px; `;
            }
            if (node.props.alignment) {
                const align = node.props.alignment;
                if (align === 'top') stackStyles += 'align-items: flex-start; ';
                else if (align === 'center') stackStyles += 'align-items: center; ';
                else if (align === 'bottom') stackStyles += 'align-items: flex-end; ';
            }
            baseHtml = `<div class="${stackClasses}"${stackStyles ? ` style="${stackStyles.trim()}"` : ''}${style}>${node.children.map(renderNode).join('')}</div>`;
            break;
            
        case 'ZStack':
            baseHtml = `<div class="zstack"${style}>${node.children.map(renderNode).join('')}</div>`;
            break;
            
        case 'Text':
            baseHtml = `<div class="text"${style}>${escapeHtml(node.props.text ?? '')}</div>`;
            break;
            
        case 'Image':
            baseHtml = `<div class="image-placeholder"${style}>${escapeHtml(node.props.name ?? 'Image')}</div>`;
            break;
            
        case 'Spacer':
            baseHtml = `<div class="spacer"${style}></div>`;
            break;
            
        default:
            baseHtml = `<div class="custom"${style}>${escapeHtml(node.kind)}</div>`;
    }
    
    // Wrap with overlay if present
    if (overlayModifier && overlayModifier.args.content) {
        const overlayContent = renderNode(overlayModifier.args.content);
        return `<div class="overlay-container" style="position: relative;">
            ${baseHtml}
            <div class="overlay-content" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
                ${overlayContent}
            </div>
        </div>`;
    }
    
    return baseHtml;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
