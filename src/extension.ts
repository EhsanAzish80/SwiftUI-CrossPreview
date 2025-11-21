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
    
    // Test tree-sitter import immediately
    try {
        const testParse = parseSwiftToViewTree('struct Test: View { var body: some View { Text("Hello") } }');
        console.log('Tree-sitter test successful:', testParse.root ? 'OK' : 'Failed');
    } catch (error) {
        console.error('Tree-sitter initialization failed:', error);
        vscode.window.showErrorMessage(`SwiftUI CrossPreview: Failed to initialize parser - ${error}`);
    }

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
                
                // Send init message with default device
                setTimeout(() => {
                    if (currentPanel) {
                        currentPanel.webview.postMessage({
                            type: 'init',
                            device: 'phone'
                        });
                    }
                }, 100);
                
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
    
    // Extract view name
    const viewName = extractViewName(source);
    
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
        error: error,
        meta: {
            viewName: viewName,
            updatedAt: new Date().toISOString()
        }
    });
}

/**
 * Extract the struct name from a Swift View
 */
function extractViewName(source: string): string | null {
    // Match struct name that conforms to View
    const match = source.match(/struct\s+(\w+)\s*:\s*View/);
    return match ? match[1] : null;
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
            background-color: #f2f2f7;
            color: #333333;
        }
        
        h1 {
            color: #1d1d1f;
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
        }
        
        #view-name {
            color: #8e8e93;
            font-size: 13px;
            text-align: center;
            margin-bottom: 16px;
            font-weight: 400;
        }
        
        #header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 8px 12px;
            background-color: #ffffff;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
        
        #device-wrapper {
            display: flex;
            justify-content: center;
            padding: 24px 0;
            transform-origin: top center;
            transition: transform 0.3s ease;
        }
        
        #device-bezel {
            background: #111216;
            border-radius: 42px;
            padding: 14px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            position: relative;
            transition: all 0.3s ease;
        }
        
        #device-bezel.device-phone {
            width: 430px;
            height: 880px;
        }
        
        #device-bezel.device-tablet {
            width: 820px;
            height: 1100px;
        }
        
        #device-bezel.device-desktop {
            width: 1024px;
            height: 768px;
        }
        
        #device-bezel.device-custom {
            width: 430px;
            height: 880px;
        }
        
        #dynamic-island {
            position: absolute;
            top: 18px;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 36px;
            background: #050608;
            border-radius: 999px;
            z-index: 10;
        }
        
        #device-screen {
            position: relative;
            margin-top: 36px;
            background: #ffffff;
            border-radius: 32px;
            overflow-y: auto;
            overflow-x: hidden;
            height: 792px;
            padding: 16px;
        }
        
        #bottom-bar {
            position: relative;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
        }
        
        #device-auto {
            background-color: #0e639c;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 13px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        #device-auto:hover {
            background-color: #1177bb;
        }
        
        .device-menu {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .device-menu label {
            font-size: 13px;
            color: #8e8e93;
        }
        
        #device-select {
            background-color: #ffffff;
            color: #1d1d1f;
            border: 1px solid #d1d1d6;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 13px;
            cursor: pointer;
        }
        
        #device-select:hover {
            background-color: #f5f5f5;
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
            background-color: transparent;
            min-height: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }
        
        .content-wrapper {
            width: 100%;
        }
        
        .status {
            color: #808080;
            font-style: italic;
        }
        
        /* SwiftUI-style layout */
        .root {
          padding: 16px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .vstack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: stretch;
        }

        .hstack {
          display: flex;
          flex-direction: row;
          gap: 8px;
        }

        .text {
          padding: 4px 8px;
          border-radius: 4px;
          background: transparent;
          color: #000000;
          font-size: 13px;
          flex-shrink: 0;
        }

        .image-placeholder {
          padding: 8px;
          border-radius: 4px;
          border: 1px dashed #888;
          font-size: 12px;
          color: #000000;
        }
        
        .spacer {
          flex: 1;
        }
        
        .list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #ffffff;
          border-radius: 12px;
          padding: 8px;
          flex-shrink: 0;
          overflow-y: auto;
          max-height: 100%;
        }
        
        .form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #ffffff;
          border-radius: 12px;
          padding: 12px;
          overflow-y: auto;
          max-height: 100%;
        }
        
        .section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .section-header {
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 600;
          color: #8e8e93;
          padding: 8px 12px 4px;
        }
        
        .section-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .scrollview {
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          max-height: 100%;
        }
        
        .foreach {
          display: contents;
        }
        
        .button {
          background: #007aff;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .button:hover {
          background: #0051d5;
        }
        
        .toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #ffffff;
          border-radius: 8px;
          cursor: pointer;
          gap: 12px;
        }
        
        .toggle input[type="checkbox"] {
          display: none;
        }
        
        .toggle-switch {
          position: relative;
          width: 51px;
          height: 31px;
          background: #e5e5ea;
          border-radius: 31px;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 27px;
          height: 27px;
          background: #ffffff;
          border-radius: 50%;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .toggle input[type="checkbox"]:checked + .toggle-switch {
          background: #34c759;
        }
        
        .toggle input[type="checkbox"]:checked + .toggle-switch::after {
          transform: translateX(20px);
        }
        
        .picker {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
        }
        
        .picker label {
          font-size: 13px;
          font-weight: 600;
          color: #3c3c43;
        }
        
        .picker select {
          padding: 8px 12px;
          background: #ffffff;
          border: 1px solid #d1d1d6;
          border-radius: 8px;
          font-size: 14px;
          color: #000000;
          cursor: pointer;
        }
        
        .gradient {
          min-width: 100px;
          min-height: 100px;
          border-radius: 8px;
        }
        
        .textfield, .securefield {
          padding: 10px 12px;
          background: #ffffff;
          border: 1px solid #d1d1d6;
          border-radius: 8px;
          font-size: 14px;
          color: #000000;
          outline: none;
          min-width: 200px;
        }
        
        .textfield:focus, .securefield:focus {
          border-color: #007aff;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }
        
        .shape {
          min-width: 100px;
          min-height: 100px;
          background: #007aff;
        }
        
        .shape.rectangle {
          border-radius: 0;
        }
        
        .shape.circle {
          border-radius: 50%;
          aspect-ratio: 1;
        }
        
        .shape.rounded-rectangle {
          /* border-radius set inline */
        }
        
        .shape.capsule {
          border-radius: 9999px;
          min-width: 100px;
          min-height: 50px;
        }
        
        .shape.ellipse {
          border-radius: 50%;
          min-width: 150px;
          min-height: 100px;
        }
        
        .divider {
          height: 1px;
          background: #d1d1d6;
          width: 100%;
          margin: 8px 0;
        }
        
        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #000000;
        }
        
        .label-icon {
          font-size: 16px;
          color: #007aff;
        }
        
        .label-text {
          font-weight: 500;
        }
        
        .animation-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 16px;
          background: rgba(0, 122, 255, 0.9);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        #custom-size-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        #custom-size-controls input {
          width: 80px;
          padding: 6px 8px;
          background: #ffffff;
          border: 1px solid #d1d1d6;
          border-radius: 4px;
          font-size: 13px;
          color: #1d1d1f;
        }
        
        #custom-size-controls span {
          color: #8e8e93;
          font-size: 13px;
        }
        
        #apply-custom-size {
          background-color: #34c759;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
        }
        
        #apply-custom-size:hover {
          background-color: #28a745;
        }
        
        #snapshot-btn {
          background-color: #ff9500;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
          margin-left: auto;
        }
        
        #snapshot-btn:hover {
          background-color: #e08600;
        }
    </style>
</head>
<body>
    <h1>SwiftUI CrossPreview</h1>
    <div id="view-name">Previewing: <span id="view-name-text">-</span></div>
    <header id="header">
        <span id="status">Live</span>
        <span id="error" class="error" style="display:none;"></span>
    </header>
    <div id="errors"></div>
    <div id="bottom-bar">
        <button id="device-auto" class="primary">iPhone (Automatic)</button>
        <div class="device-menu">
            <label>Device:</label>
            <select id="device-select">
                <option value="phone">iPhone</option>
                <option value="tablet">iPad</option>
                <option value="desktop">Desktop</option>
                <option value="custom">Custom</option>
            </select>
        </div>
        <div id="custom-size-controls" style="display: none;">
            <input type="number" id="custom-width" placeholder="Width" min="100" max="2000" value="430">
            <span>×</span>
            <input type="number" id="custom-height" placeholder="Height" min="100" max="2000" value="880">
            <button id="apply-custom-size">Apply</button>
        </div>
        <button id="snapshot-btn" title="Export Snapshot">📸 Snapshot</button>
    </div>
    <div id="device-wrapper">
        <div id="device-bezel" class="device-phone">
            <div id="dynamic-island"></div>
            <div id="device-screen">
                <div id="root">
                    <p class="status">Waiting for Swift file content...</p>
                </div>
            </div>
        </div>
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
                                } else if (mod.args.material) {
                                    const matStyles = getMaterialStyles(mod.args.material);
                                    styles.push.apply(styles, matStyles);
                                }
                                break;
                            case 'backgroundMaterial':
                            case 'material':
                                if (mod.args.material || mod.args.kind) {
                                    const matStyles = getMaterialStyles(mod.args.material || mod.args.kind);
                                    styles.push.apply(styles, matStyles);
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
                            case 'shadow':
                                const radius = mod.args.radius !== undefined ? mod.args.radius : 8;
                                styles.push('box-shadow: 0 ' + (radius / 2) + 'px ' + (radius * 2) + 'px rgba(0,0,0,0.35)');
                                break;
                            case 'opacity':
                                if (mod.args.value !== undefined) {
                                    styles.push('opacity: ' + mod.args.value);
                                }
                                break;
                            case 'blur':
                                if (mod.args.radius !== undefined) {
                                    styles.push('filter: blur(' + mod.args.radius + 'px)');
                                }
                                break;
                            case 'multilineTextAlignment':
                                if (mod.args.alignment) {
                                    if (mod.args.alignment === 'leading') styles.push('text-align: left');
                                    else if (mod.args.alignment === 'center') styles.push('text-align: center');
                                    else if (mod.args.alignment === 'trailing') styles.push('text-align: right');
                                }
                                break;
                            case 'lineLimit':
                                if (mod.args.lines !== undefined) {
                                    styles.push('display: -webkit-box');
                                    styles.push('-webkit-line-clamp: ' + mod.args.lines);
                                    styles.push('-webkit-box-orient: vertical');
                                    styles.push('overflow: hidden');
                                }
                                break;
                            case 'animation':
                                styles.push('position: relative');
                                break;
                            case 'rotationEffect':
                                if (mod.args.degrees !== undefined) {
                                    styles.push('transform: rotate(' + mod.args.degrees + 'deg)');
                                } else if (mod.args.radians !== undefined) {
                                    var degrees = mod.args.radians * (180 / Math.PI);
                                    styles.push('transform: rotate(' + degrees + 'deg)');
                                }
                                break;
                            case 'scaleEffect':
                                var scale = mod.args.scale !== undefined ? mod.args.scale : 1;
                                styles.push('transform: scale(' + scale + ')');
                                break;
                            case 'offset':
                                if (mod.args.x !== undefined || mod.args.y !== undefined) {
                                    var x = mod.args.x || 0;
                                    var y = mod.args.y || 0;
                                    styles.push('transform: translate(' + x + 'px, ' + y + 'px)');
                                }
                                break;
                            case 'border':
                                var borderWidth = mod.args.width || 1;
                                var borderColor = mod.args.color ? swiftColorToCss(mod.args.color) : '#000000';
                                styles.push('border: ' + borderWidth + 'px solid ' + borderColor);
                                break;
                            case 'fill':
                                if (mod.args.color) {
                                    styles.push('background-color: ' + swiftColorToCss(mod.args.color));
                                }
                                break;
                            case 'stroke':
                                if (mod.args.color) {
                                    var strokeWidth = mod.args.lineWidth || 1;
                                    styles.push('border: ' + strokeWidth + 'px solid ' + swiftColorToCss(mod.args.color));
                                    styles.push('background-color: transparent');
                                }
                                break;
                            case 'bold':
                                styles.push('font-weight: bold');
                                break;
                            case 'italic':
                                styles.push('font-style: italic');
                                break;
                            case 'underline':
                                styles.push('text-decoration: underline');
                                break;
                            case 'strikethrough':
                                styles.push('text-decoration: line-through');
                                break;
                            case 'clipped':
                                styles.push('overflow: hidden');
                                break;
                            case 'onTapGesture':
                                styles.push('cursor: pointer');
                                styles.push('user-select: none');
                                break;
                        }
                    }
                    
                    return styles.length > 0 ? ' style="' + styles.join('; ') + '"' : '';
                }
                
                function getMaterialStyles(kind) {
                    const styles = [];
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
                    // Check for overlay modifier
                    const overlayMod = n.modifiers && n.modifiers.find(function(m) { return m.name === 'overlay'; });
                    
                    const style = buildStyle(n);
                    let baseHtml = '';
                    let stackStyles = '';
                    
                    switch (n.kind) {
                        case 'VStack':
                            if (n.props.spacing !== undefined) {
                                stackStyles += 'gap: ' + n.props.spacing + 'px; ';
                            }
                            if (n.props.alignment) {
                                if (n.props.alignment === 'leading') stackStyles += 'align-items: flex-start; ';
                                else if (n.props.alignment === 'center') stackStyles += 'align-items: center; ';
                                else if (n.props.alignment === 'trailing') stackStyles += 'align-items: flex-end; ';
                            }
                            baseHtml = '<div class="vstack"' + (stackStyles ? ' style="' + stackStyles.trim() + '"' : '') + style + '>' + n.children.map(renderNode).join('') + '</div>';
                            break;
                        case 'HStack':
                            if (n.props.spacing !== undefined) {
                                stackStyles += 'gap: ' + n.props.spacing + 'px; ';
                            }
                            if (n.props.alignment) {
                                if (n.props.alignment === 'top') stackStyles += 'align-items: flex-start; ';
                                else if (n.props.alignment === 'center') stackStyles += 'align-items: center; ';
                                else if (n.props.alignment === 'bottom') stackStyles += 'align-items: flex-end; ';
                            }
                            baseHtml = '<div class="hstack"' + (stackStyles ? ' style="' + stackStyles.trim() + '"' : '') + style + '>' + n.children.map(renderNode).join('') + '</div>';
                            break;
                        case 'ZStack':
                            baseHtml = '<div class="zstack"' + style + '>' + n.children.map(renderNode).join('') + '</div>';
                            break;
                        case 'Text':
                            baseHtml = '<div class="text"' + style + '>' + escapeHtml(n.props.text || '') + '</div>';
                            break;
                        case 'Image':
                            baseHtml = '<div class="image-placeholder"' + style + '>' + escapeHtml(n.props.name || 'Image') + '</div>';
                            break;
                        case 'Spacer':
                            baseHtml = '<div class="spacer"' + style + '></div>';
                            break;
                        case 'List':
                            baseHtml = '<div class="list"' + style + '>' + n.children.map(renderNode).join('') + '</div>';
                            break;
                        case 'Form':
                            baseHtml = '<div class="form"' + style + '>' + n.children.map(renderNode).join('') + '</div>';
                            break;
                        case 'Section':
                            var headerHtml = n.props.header ? '<div class="section-header">' + escapeHtml(n.props.header) + '</div>' : '';
                            baseHtml = '<div class="section"' + style + '>' + headerHtml + '<div class="section-body">' + n.children.map(renderNode).join('') + '</div></div>';
                            break;
                        case 'ScrollView':
                            baseHtml = '<div class="scrollview"' + style + '>' + n.children.map(renderNode).join('') + '</div>';
                            break;
                        case 'ForEach':
                            baseHtml = renderForEach(n);
                            break;
                        case 'Button':
                            var buttonLabel = n.children.map(renderNode).join('');
                            baseHtml = '<button class="button"' + style + '>' + (buttonLabel || 'Button') + '</button>';
                            break;
                        case 'Toggle':
                            var toggleLabel = n.props.label || 'Toggle';
                            var toggleState = n.props.isOn ? 'checked' : '';
                            baseHtml = '<label class="toggle"' + style + '><span>' + escapeHtml(toggleLabel) + '</span><input type="checkbox" ' + toggleState + '><span class="toggle-switch"></span></label>';
                            break;
                        case 'Picker':
                            var pickerLabel = n.props.label || 'Picker';
                            var pickerOptions = n.children.map(function(child) {
                                if (child.kind === 'Text') {
                                    return '<option>' + escapeHtml(child.props.text || '') + '</option>';
                                }
                                return '';
                            }).join('');
                            baseHtml = '<div class="picker"' + style + '><label>' + escapeHtml(pickerLabel) + '</label><select>' + (pickerOptions || '<option>Option</option>') + '</select></div>';
                            break;
                        case 'LinearGradient':
                            var linearColors = n.props.colors || ['blue', 'purple'];
                            var startPoint = mapGradientPoint(n.props.startPoint || 'top');
                            var endPoint = mapGradientPoint(n.props.endPoint || 'bottom');
                            var angle = calculateGradientAngle(startPoint, endPoint);
                            var linearGradient = 'linear-gradient(' + angle + 'deg, ' + linearColors.map(function(c) { return swiftColorToCss(c); }).join(', ') + ')';
                            baseHtml = '<div class="gradient"' + style + ' style="background: ' + linearGradient + ';"></div>';
                            break;
                        case 'RadialGradient':
                            var radialColors = n.props.colors || ['blue', 'purple'];
                            var radialGradient = 'radial-gradient(circle, ' + radialColors.map(function(c) { return swiftColorToCss(c); }).join(', ') + ')';
                            baseHtml = '<div class="gradient"' + style + ' style="background: ' + radialGradient + ';"></div>';
                            break;
                        case 'TextField':
                            var placeholder = n.props.placeholder || 'Enter text';
                            baseHtml = '<input type="text" class="textfield" placeholder="' + escapeHtml(placeholder) + '"' + style + '>';
                            break;
                        case 'SecureField':
                            var secureplaceholder = n.props.placeholder || 'Enter password';
                            baseHtml = '<input type="password" class="textfield securefield" placeholder="' + escapeHtml(secureplaceholder) + '"' + style + '>';
                            break;
                        case 'Rectangle':
                            baseHtml = '<div class="shape rectangle"' + style + '></div>';
                            break;
                        case 'Circle':
                            baseHtml = '<div class="shape circle"' + style + '></div>';
                            break;
                        case 'RoundedRectangle':
                            var cornerRadius = n.props.cornerRadius || 8;
                            var rectStyle = style ? style.replace('"', ' border-radius: ' + cornerRadius + 'px;"') : ' style="border-radius: ' + cornerRadius + 'px;"';
                            baseHtml = '<div class="shape rounded-rectangle"' + rectStyle + '></div>';
                            break;
                        case 'Capsule':
                            baseHtml = '<div class="shape capsule"' + style + '></div>';
                            break;
                        case 'Ellipse':
                            baseHtml = '<div class="shape ellipse"' + style + '></div>';
                            break;
                        case 'Divider':
                            baseHtml = '<div class="divider"' + style + '></div>';
                            break;
                        case 'Label':
                            var labelTitle = n.props.title || '';
                            var labelIcon = n.props.systemImage || '';
                            var iconHtml = labelIcon ? '<span class="label-icon">○</span>' : '';
                            baseHtml = '<div class="label"' + style + '>' + iconHtml + '<span class="label-text">' + escapeHtml(labelTitle) + '</span></div>';
                            break;
                        default:
                            baseHtml = '<div class="custom"' + style + '>' + escapeHtml(n.kind) + '</div>';
                    }
                    
                    // Wrap with overlay if present
                    if (overlayMod && overlayMod.args.content) {
                        var overlayHtml = renderNode(overlayMod.args.content);
                        return '<div class="overlay-container" style="position: relative;">' +
                            baseHtml +
                            '<div class="overlay-content" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">' +
                            overlayHtml +
                            '</div></div>';
                    }
                    
                    // Add animation indicator
                    var animationMod = n.modifiers && n.modifiers.find(function(m) { return m.name === 'animation'; });
                    if (animationMod) {
                        return '<div style="position: relative; display: inline-block;">' +
                            baseHtml +
                            '<div class="animation-badge" title="Animated">🎬</div></div>';
                    }
                    
                    return baseHtml;
                }
                
                function renderForEach(n) {
                    if (!n.props.rowTemplate) {
                        return '<div class="foreach"></div>';
                    }
                    
                    var iterations = 0;
                    var items = [];
                    
                    if (n.props.forEachRange) {
                        var start = n.props.forEachRange.start;
                        var end = n.props.forEachRange.end;
                        iterations = end - start;
                        for (var i = start; i < end; i++) {
                            items.push(i);
                        }
                    } else if (n.props.forEachItems) {
                        iterations = n.props.forEachItems.length;
                        items = n.props.forEachItems.slice();
                    }
                    
                    var rows = [];
                    for (var i = 0; i < iterations; i++) {
                        var cloned = cloneViewNode(n.props.rowTemplate);
                        rows.push(renderNode(cloned));
                    }
                    
                    return '<div class="foreach">' + rows.join('') + '</div>';
                }
                
                function cloneViewNode(node) {
                    return {
                        kind: node.kind,
                        props: Object.assign({}, node.props),
                        modifiers: node.modifiers ? node.modifiers.map(function(m) {
                            return { name: m.name, args: Object.assign({}, m.args) };
                        }) : [],
                        children: node.children ? node.children.map(cloneViewNode) : []
                    };
                }
                
                function mapGradientPoint(point) {
                    var pointMap = {
                        'top': { x: 50, y: 0 },
                        'bottom': { x: 50, y: 100 },
                        'leading': { x: 0, y: 50 },
                        'trailing': { x: 100, y: 50 },
                        'topLeading': { x: 0, y: 0 },
                        'topTrailing': { x: 100, y: 0 },
                        'bottomLeading': { x: 0, y: 100 },
                        'bottomTrailing': { x: 100, y: 100 },
                        'center': { x: 50, y: 50 }
                    };
                    return pointMap[point] || { x: 50, y: 50 };
                }
                
                function calculateGradientAngle(start, end) {
                    var dx = end.x - start.x;
                    var dy = end.y - start.y;
                    var angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                    return Math.round(angle);
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
                
                if (msg.type === 'init') {
                    // Initialize device selection
                    const device = msg.device || 'phone';
                    setDevice(device);
                } else if (msg.type === 'render') {
                    const rootEl = document.getElementById('root');
                    const statusEl = document.getElementById('status');
                    const errorEl = document.getElementById('error');
                    const errorsEl = document.getElementById('errors');
                    const viewNameEl = document.getElementById('view-name-text');
                    
                    // Update view name
                    if (msg.meta && msg.meta.viewName) {
                        viewNameEl.textContent = msg.meta.viewName;
                    } else {
                        viewNameEl.textContent = '-';
                    }
                    
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
                        rootEl.innerHTML = '<div class="content-wrapper">' + renderToHtml(msg.root) + '</div>';
                    } else if (msg.html) {
                        rootEl.innerHTML = '<div class="content-wrapper">' + msg.html + '</div>';
                    } else {
                        rootEl.innerHTML = '<div class="empty">No preview available</div>';
                    }
                    
                    // Update status timestamp
                    if (statusEl && msg.meta && msg.meta.updatedAt) {
                        const time = new Date(msg.meta.updatedAt).toLocaleTimeString();
                        statusEl.textContent = 'Live · ' + time;
                    }
                }
            });
            
            // Device selection handling
            function setDevice(device) {
                const bezel = document.getElementById('device-bezel');
                const select = document.getElementById('device-select');
                
                bezel.classList.remove('device-phone', 'device-tablet', 'device-desktop');
                bezel.classList.add('device-' + device);
                
                select.value = device;
                
                // Persist selection
                vscode.setState({ device: device });
            }
            
            // Restore previous device selection
            const state = vscode.getState();
            if (state && state.device) {
                setDevice(state.device);
            } else {
                setDevice('phone');
            }
            
            // Device select change handler
            document.getElementById('device-select').addEventListener('change', (e) => {
                setDevice(e.target.value);
            });
            
            // Auto button handler
            document.getElementById('device-auto').addEventListener('click', () => {
                setDevice('phone');
            });
            
            // Custom size application
            document.getElementById('apply-custom-size').addEventListener('click', () => {
                const bezel = document.getElementById('device-bezel');
                const width = parseInt(document.getElementById('custom-width').value) || 430;
                const height = parseInt(document.getElementById('custom-height').value) || 880;
                
                bezel.style.width = width + 'px';
                bezel.style.height = height + 'px';
                
                setTimeout(updateZoom, 100);
            });
            
            // Snapshot export handler
            document.getElementById('snapshot-btn').addEventListener('click', () => {
                const root = document.getElementById('root');
                const deviceScreen = document.getElementById('device-screen');
                
                // Create a temporary canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size to match device screen
                canvas.width = deviceScreen.offsetWidth;
                canvas.height = deviceScreen.offsetHeight;
                
                // Get computed styles
                const bgColor = window.getComputedStyle(deviceScreen).backgroundColor;
                
                // Fill background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Convert HTML to image (simplified - just show a message)
                const dataUrl = canvas.toDataURL('image/png');
                
                // Create download link
                const link = document.createElement('a');
                link.download = 'swiftui-preview-' + Date.now() + '.png';
                link.href = dataUrl;
                link.click();
                
                // Show notification
                const statusEl = document.getElementById('status');
                const originalText = statusEl.textContent;
                statusEl.textContent = '📸 Snapshot saved!';
                statusEl.style.color = '#34c759';
                setTimeout(() => {
                    statusEl.textContent = originalText;
                    statusEl.style.color = '#4ec9b0';
                }, 2000);
            });
            
            // Zoom to fit window
            function updateZoom() {
                const wrapper = document.getElementById('device-wrapper');
                const bezel = document.getElementById('device-bezel');
                const container = document.body;
                
                if (!wrapper || !bezel) return;
                
                // Get dimensions
                const containerWidth = container.clientWidth - 40; // Account for padding
                const containerHeight = window.innerHeight - 280; // Account for header/footer
                const bezelWidth = bezel.offsetWidth;
                const bezelHeight = bezel.offsetHeight;
                
                // Calculate scale to fit
                const scaleX = containerWidth / bezelWidth;
                const scaleY = containerHeight / bezelHeight;
                const scale = Math.min(scaleX, scaleY); // Allow scaling down for all devices
                
                // Apply transform (clamp to reasonable range)
                const finalScale = Math.max(0.3, Math.min(scale, 1));
                wrapper.style.transform = 'scale(' + finalScale + ')';
            }
            
            // Initial zoom
            setTimeout(updateZoom, 100);
            
            // Update on window resize
            window.addEventListener('resize', updateZoom);
            
            // Update when device changes
            const originalSetDevice = setDevice;
            setDevice = function(device) {
                originalSetDevice(device);
                setTimeout(updateZoom, 100);
            };
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
