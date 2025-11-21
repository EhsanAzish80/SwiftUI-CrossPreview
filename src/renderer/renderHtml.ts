import { ViewNode } from '../parser/viewTree';

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

function renderNode(node: ViewNode): string {
    switch (node.kind) {
        case 'VStack':
            return `<div class="vstack">${node.children.map(renderNode).join('')}</div>`;
        case 'HStack':
            return `<div class="hstack">${node.children.map(renderNode).join('')}</div>`;
        case 'Text':
            return `<div class="text">${escapeHtml(node.props.text ?? '')}</div>`;
        case 'Image':
            return `<div class="image-placeholder">${escapeHtml(node.props.name ?? 'Image')}</div>`;
        default:
            return `<div class="custom">${escapeHtml(node.kind)}</div>`;
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
