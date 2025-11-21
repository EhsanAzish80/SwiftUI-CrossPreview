// Copilot: This extension should open a "SwiftUI CrossPreview" webview for
// the active Swift file, send its text to parser/, receive a ViewNode tree,
// and forward it to renderer/ to produce HTML for the webview.

import * as vscode from 'vscode';
import { parseSwiftToViewTree } from './parser/swiftParser';
import { renderToHtml, renderErrorBanner } from './renderer/renderHtml';

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let currentDocumentUri: vscode.Uri | undefined = undefined;
let changeSubscription: vscode.Disposable | undefined = undefined;
let updateTimeout: NodeJS.Timeout | undefined = undefined;

/**
 * Activates the extension
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('SwiftUI CrossPreview extension is now active');

    // Register command to open preview
    const disposable = vscode.commands.registerCommand(
        'swiftuiPreview.open',
        () => {
            // Get the active text editor
            const editor = vscode.window.activeTextEditor;
            
            if (!editor) {
                vscode.window.showWarningMessage('No active Swift file. Please open a Swift file first.');
                return;
            }
            
            // Check if it's a Swift file
            if (editor.document.languageId !== 'swift') {
                vscode.window.showWarningMessage('Active file is not a Swift file. Please open a .swift file.');
                return;
            }
            
            // Set current document URI
            currentDocumentUri = editor.document.uri;
            
            // Create or reveal the preview panel
            if (currentPanel) {
                currentPanel.reveal(vscode.ViewColumn.Two);
            } else {
                currentPanel = vscode.window.createWebviewPanel(
                    'swiftUIPreview',
                    'SwiftUI CrossPreview',
                    vscode.ViewColumn.Two,
                    {
                        enableScripts: true,
                        retainContextWhenHidden: true,
                        localResourceRoots: [
                            vscode.Uri.joinPath(context.extensionUri, 'media')
                        ]
                    }
                );
                
                // Set the HTML content
                currentPanel.webview.html = getPreviewHtml(currentPanel.webview, context);
                
                // Handle disposal
                currentPanel.onDidDispose(() => {
                    currentPanel = undefined;
                    currentDocumentUri = undefined;
                    if (changeSubscription) {
                        changeSubscription.dispose();
                        changeSubscription = undefined;
                    }
                    if (updateTimeout) {
                        clearTimeout(updateTimeout);
                        updateTimeout = undefined;
                    }
                });
            }
            
            // Start live preview
            startLivePreviewForDocument(editor.document, currentPanel, context);
        }
    );

    context.subscriptions.push(disposable);
}

/**
 * Start live preview for a document with auto-update on changes
 */
function startLivePreviewForDocument(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
) {
    // Dispose existing subscription if any
    if (changeSubscription) {
        changeSubscription.dispose();
    }
    
    // Initial render
    updatePreviewFromDocument(document, panel);
    
    // Subscribe to document changes
    changeSubscription = vscode.workspace.onDidChangeTextDocument(event => {
        if (currentDocumentUri && event.document.uri.toString() === currentDocumentUri.toString()) {
            // Debounce updates (300ms)
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            updateTimeout = setTimeout(() => {
                updatePreviewFromDocument(event.document, panel);
            }, 300);
        }
    });
    
    context.subscriptions.push(changeSubscription);
}

/**
 * Update preview from document content
 */
function updatePreviewFromDocument(document: vscode.TextDocument, panel: vscode.WebviewPanel) {
    const source = document.getText();
    
    // Parse with tree-sitter
    const { root, errors } = parseSwiftToViewTree(source);
    
    let html = '';
    let errorHtml = '';
    let error: string | null = null;
    
    if (root) {
        html = renderToHtml(root);
        if (errors.length > 0) {
            errorHtml = renderErrorBanner(errors);
            error = errors.join('; ');
        }
    } else {
        // Parse failed completely
        const errorMessages = errors.length > 0 ? errors : ['Could not parse SwiftUI view'];
        errorHtml = renderErrorBanner(errorMessages);
        error = errorMessages.join('; ');
    }
    
    // Send to webview
    panel.webview.postMessage({
        type: 'render',
        root: root,
        html: html,
        errorHtml: errorHtml,
        error: error
    });
}

/**
 * Generates the HTML content for the preview webview
 */
function getPreviewHtml(webview: vscode.Webview, context: vscode.ExtensionContext): string {
    // For simplicity, inline the HTML content
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <title>SwiftUI CrossPreview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #1e1e1e;
            color: #d4d4d4;
        }
        
        h1 {
            color: #ffffff;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        #header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 8px 12px;
            background-color: #252526;
            border-radius: 4px;
        }
        
        #status {
            color: #4ec9b0;
            font-size: 12px;
            font-weight: 500;
        }
        
        .error {
            color: #f48771;
            font-size: 12px;
        }
        
        #errors {
            margin-bottom: 16px;
        }
        
        .error-banner {
            background-color: #5a1d1d;
            border-left: 4px solid #f48771;
            padding: 12px 16px;
            border-radius: 4px;
            color: #f48771;
        }
        
        .error-banner strong {
            display: block;
            margin-bottom: 8px;
            color: #ffffff;
        }
        
        .error-banner ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .error-banner li {
            margin: 4px 0;
        }
        
        #root {
            background-color: #252526;
            border-radius: 8px;
            padding: 20px;
            min-height: 300px;
        }
        
        .status {
            color: #808080;
            font-style: italic;
        }
        
        /* SwiftUI-style layout */
        .root {
          padding: 16px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .vstack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hstack {
          display: flex;
          flex-direction: row;
          gap: 8px;
        }

        .text {
          padding: 4px 8px;
          border-radius: 4px;
          background: #1e1e1e;
          color: #f5f5f5;
          font-size: 13px;
        }

        .image-placeholder {
          padding: 8px;
          border-radius: 4px;
          border: 1px dashed #888;
          font-size: 12px;
        }
        
        .spacer {
          flex: 1;
        }
    </style>
</head>
<body>
    <h1>SwiftUI CrossPreview</h1>
    <header id="header">
        <span id="status">Live</span>
        <span id="error" class="error" style="display:none;"></span>
    </header>
    <div id="errors"></div>
    <div id="root">
        <p class="status">Waiting for Swift file content...</p>
    </div>
    
    <script>
        (function() {
            const vscode = acquireVsCodeApi();
            
            // Client-side ViewNode renderer
            function renderToHtml(node) {
                if (!node) return '';
                
                function buildStyle(n) {
                    if (!n.modifiers || n.modifiers.length === 0) return '';
                    
                    const styles = [];
                    
                    for (const mod of n.modifiers) {
                        switch (mod.name) {
                            case 'padding':
                                if (mod.args.all !== undefined) {
                                    styles.push('padding: ' + mod.args.all + 'px');
                                } else {
                                    styles.push('padding: 8px');
                                }
                                break;
                            case 'foregroundColor':
                                if (mod.args.color) {
                                    styles.push('color: ' + swiftColorToCss(mod.args.color));
                                }
                                break;
                            case 'background':
                                if (mod.args.color) {
                                    styles.push('background-color: ' + swiftColorToCss(mod.args.color));
                                }
                                break;
                            case 'font':
                                if (mod.args.style) {
                                    const font = swiftFontStyleToCss(mod.args.style);
                                    styles.push('font-size: ' + font.fontSize);
                                    styles.push('font-weight: ' + font.fontWeight);
                                }
                                break;
                            case 'frame':
                                if (mod.args.width !== undefined) {
                                    styles.push('width: ' + mod.args.width + 'px');
                                }
                                if (mod.args.height !== undefined) {
                                    styles.push('height: ' + mod.args.height + 'px');
                                }
                                break;
                            case 'cornerRadius':
                                if (mod.args.radius !== undefined) {
                                    styles.push('border-radius: ' + mod.args.radius + 'px');
                                }
                                break;
                        }
                    }
                    
                    return styles.length > 0 ? ' style="' + styles.join('; ') + '"' : '';
                }
                
                function swiftColorToCss(color) {
                    const map = {
                        'red': '#ff3b30', 'orange': '#ff9500', 'yellow': '#ffcc00',
                        'green': '#34c759', 'mint': '#00c7be', 'teal': '#30b0c7',
                        'cyan': '#32ade6', 'blue': '#007aff', 'indigo': '#5856d6',
                        'purple': '#af52de', 'pink': '#ff2d55', 'brown': '#a2845e',
                        'white': '#ffffff', 'gray': '#8e8e93', 'black': '#000000',
                        'clear': 'transparent'
                    };
                    return map[color.toLowerCase()] || color;
                }
                
                function swiftFontStyleToCss(style) {
                    const map = {
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
                    return map[style] || { fontSize: '14px', fontWeight: 'normal' };
                }
                
                function renderNode(n) {
                    const style = buildStyle(n);
                    
                    switch (n.kind) {
                        case 'VStack':
                            return '<div class="vstack"' + style + '>' + n.children.map(renderNode).join('') + '</div>';
                        case 'HStack':
                            return '<div class="hstack"' + style + '>' + n.children.map(renderNode).join('') + '</div>';
                        case 'Text':
                            return '<div class="text"' + style + '>' + escapeHtml(n.props.text || '') + '</div>';
                        case 'Image':
                            return '<div class="image-placeholder"' + style + '>' + escapeHtml(n.props.name || 'Image') + '</div>';
                        case 'Spacer':
                            return '<div class="spacer"' + style + '></div>';
                        default:
                            return '<div class="custom"' + style + '>' + escapeHtml(n.kind) + '</div>';
                    }
                }
                
                function escapeHtml(str) {
                    return str.replace(/&/g, "&amp;")
                              .replace(/</g, "&lt;")
                              .replace(/>/g, "&gt;");
                }
                
                return '<div class="root">' + renderNode(node) + '</div>';
            }
            
            window.addEventListener('message', event => {
                const msg = event.data;
                if (msg.type === 'render') {
                    const rootEl = document.getElementById('root');
                    const statusEl = document.getElementById('status');
                    const errorEl = document.getElementById('error');
                    const errorsEl = document.getElementById('errors');
                    
                    // Update error display
                    if (msg.error) {
                        errorEl.textContent = msg.error;
                        errorEl.style.display = 'inline';
                    } else {
                        errorEl.textContent = '';
                        errorEl.style.display = 'none';
                    }
                    
                    // Update error banner
                    errorsEl.innerHTML = msg.errorHtml || '';
                    
                    // Update root content
                    if (msg.root) {
                        rootEl.innerHTML = renderToHtml(msg.root);
                    } else if (msg.html) {
                        rootEl.innerHTML = msg.html;
                    } else {
                        rootEl.innerHTML = '<div class="empty">No preview available</div>';
                    }
                    
                    // Update status timestamp
                    if (statusEl) {
                        statusEl.textContent = 'Live · Last update: ' + new Date().toLocaleTimeString();
                    }
                }
            });
        })();
    </script>
</body>
</html>`;
}

/**
 * Deactivates the extension
 */
export function deactivate() {
    console.log('SwiftUI CrossPreview extension is now deactivated');
}
