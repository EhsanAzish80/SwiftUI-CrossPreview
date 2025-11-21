// Copilot: This extension should open a "SwiftUI CrossPreview" webview for
// the active Swift file, send its text to parser/, receive a ViewNode tree,
// and forward it to renderer/ to produce HTML for the webview.

import * as vscode from 'vscode';
import { createPreviewPanel } from './previewPanel';
import { parseSwiftUI } from './parser/swiftParser';

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
            
            // Parse the SwiftUI code
            const viewTree = parseSwiftUI(swiftCode);
            
            if (!viewTree) {
                vscode.window.showErrorMessage('Failed to parse SwiftUI code. Make sure the file contains a View struct with a body property.');
                return;
            }
            
            // Create or show the preview panel
            const panel = createPreviewPanel(context);
            
            // Send the view tree to the webview
            panel.webview.postMessage({
                type: 'render',
                root: viewTree
            });
        }
    );

    context.subscriptions.push(disposable);
}

/**
 * Deactivates the extension
 */
export function deactivate() {
    console.log('SwiftUI CrossPreview extension is now deactivated');
}
