// Copilot: This extension should open a "SwiftUI CrossPreview" webview for
// the active Swift file, send its text to parser/, receive a ViewNode tree,
// and forward it to renderer/ to produce HTML for the webview.

import * as vscode from 'vscode';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

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
            
            // Get the Swift code
            const swiftCode = editor.document.getText();
            
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
                });
            }
            
            // Send the Swift code to the webview
            currentPanel.webview.postMessage({
                type: 'update',
                code: swiftCode
            });
        }
    );

    context.subscriptions.push(disposable);
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
        
        #root {
            background-color: #252526;
            border-radius: 8px;
            padding: 20px;
            min-height: 300px;
        }
        
        pre {
            background-color: #1e1e1e;
            border: 1px solid #3e3e42;
            border-radius: 4px;
            padding: 15px;
            overflow-x: auto;
            font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #d7ba7d;
            margin: 0;
        }
        
        .status {
            color: #808080;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h1>SwiftUI CrossPreview</h1>
    <div id="root">
        <p class="status">Waiting for Swift file content...</p>
    </div>
    
    <script>
        (function() {
            const vscode = acquireVsCodeApi();
            
            window.addEventListener('message', event => {
                const msg = event.data;
                if (msg.type === 'update') {
                    const root = document.getElementById('root');
                    root.innerHTML = '<pre>' + escapeHtml(msg.code) + '</pre>';
                }
            });
            
            function escapeHtml(str) {
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
            }
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
