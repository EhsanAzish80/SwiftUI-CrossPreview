import * as vscode from 'vscode';
import { createPreviewPanel } from './previewPanel';

/**
 * Activates the extension
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('SwiftUI CrossPreview extension is now active');

    // Register command to open preview
    const disposable = vscode.commands.registerCommand(
        'swiftuiPreview.open',
        () => {
            createPreviewPanel(context);
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
