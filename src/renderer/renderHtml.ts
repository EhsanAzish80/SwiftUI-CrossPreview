import { ViewNode } from '../parser/viewTree';

/**
 * Renders a ViewNode tree to HTML
 * For now, returns a simple JSON representation
 */
export function renderToHtml(root: ViewNode): string {
    const jsonStr = JSON.stringify(root, null, 2);
    
    return `
        <div class="preview-container">
            <h2>SwiftUI View Tree</h2>
            <pre class="view-tree-json">${escapeHtml(jsonStr)}</pre>
        </div>
    `;
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
