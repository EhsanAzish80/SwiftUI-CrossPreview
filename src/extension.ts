import * as vscode from 'vscode';

/**
 * Activates the extension
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('SwiftUI CrossPreview extension is now active');

    // Register command to open preview
    const disposable = vscode.commands.registerCommand(
        'swiftui-crosspreview.openPreview',
        () => {
            SwiftUIPreviewPanel.createOrShow(context.extensionUri);
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

/**
 * Manages SwiftUI preview webview panels
 */
class SwiftUIPreviewPanel {
    public static currentPanel: SwiftUIPreviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (SwiftUIPreviewPanel.currentPanel) {
            SwiftUIPreviewPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            'swiftUIPreview',
            'SwiftUI Preview',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media'),
                    vscode.Uri.joinPath(extensionUri, 'dist')
                ]
            }
        );

        SwiftUIPreviewPanel.currentPanel = new SwiftUIPreviewPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            () => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showInformationMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        SwiftUIPreviewPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.title = 'SwiftUI Preview';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Get the local path to css file
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'preview.css')
        );

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${styleUri}" rel="stylesheet">
            <title>SwiftUI Preview</title>
        </head>
        <body>
            <div class="container">
                <h1>SwiftUI CrossPreview</h1>
                <p>Welcome to the SwiftUI CrossPreview extension!</p>
                <p>This is a simple webview demonstrating the extension structure.</p>
                <div class="preview-area">
                    <p>Preview area - SwiftUI components will be rendered here</p>
                </div>
            </div>
            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                
                // Example: Send message to extension
                // vscode.postMessage({ command: 'alert', text: 'Hello from webview!' });
            </script>
        </body>
        </html>`;
    }
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
