# Development Guide

## Setup

```bash
npm install
```

## Dev loop

```bash
npm run watch    # or npm run compile
# Then press F5 in VS Code to launch the Extension Development Host
```

## Test command

Open a .swift file → run "SwiftUI CrossPreview: Open Preview" from the Command Palette.

## Device Presets

The preview includes a toolbar with device presets:
- **Phone** - 390px max-width (iPhone-like)
- **Tablet** - 768px max-width (iPad-like)  
- **Desktop** - 1024px max-width

Device selection is persisted using VS Code's webview state API.

## Packaging for Distribution

### Quick Start (Using Pre-built Bundle)

If `dist/extension.js` already exists (it does!), you can package immediately without installing dependencies:

```bash
vsce package --no-dependencies
```

✅ This creates `swiftui-crosspreview-0.0.2.vsix` ready to install!

### Prerequisites

Install `vsce` (Visual Studio Code Extensions) CLI:

```bash
npm install -g @vscode/vsce
```

### Important Note About Dependencies

This extension uses native Node modules (tree-sitter) that are bundled by esbuild. The packaged extension does NOT need npm dependencies at runtime since everything is bundled into `dist/extension.js`.

### Build and Package

**Option 1: Quick Package (Recommended)**

If you already have `node_modules` installed from development:

```bash
# Build extension bundle (uses existing node_modules)
npm run build

# Create .vsix package (skips dependency validation)
vsce package --no-dependencies
```

**Option 2: Full Clean Build**

If you need to reinstall dependencies:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build extension bundle
npm run build

# Create .vsix package
vsce package --no-dependencies
```

**Note:** We use `--no-dependencies` because:
1. esbuild bundles all dependencies into `dist/extension.js`
2. tree-sitter requires native compilation which can fail on some systems
3. The packaged extension doesn't need `node_modules` at runtime
4. This is standard practice for bundled VS Code extensions

### Troubleshooting

**If `npm install` fails with tree-sitter errors:**

The extension will still work! Just run:

```bash
npm run build  # This will fail, but that's OK
```

Then manually copy your existing `dist/` folder or use the pre-built one.

**If TypeScript compilation fails:**

```bash
npm run compile
```

Check for errors in TypeScript files and fix them.

This creates a `.vsix` file (e.g., `swiftui-crosspreview-0.0.2.vsix`) in the workspace root.

### Install Locally

To test the packaged extension:

1. Open VS Code
2. Go to Extensions view (⇧⌘X / Ctrl+Shift+X)
3. Click the `...` menu at the top
4. Select **"Install from VSIX..."**
5. Choose the generated `.vsix` file

### Publish to Marketplace

1. Get a Personal Access Token from [Azure DevOps](https://dev.azure.com/)
2. Create publisher account at [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
3. Publish:
   ```bash
   npm run publish
   ```
   
   Or manually:
   ```bash
   vsce publish
   ```

### Files Excluded from Package

See `.vscodeignore` for the complete list. Key exclusions:
- `src/**` - TypeScript source files
- `node_modules/**` - Dependencies (bundled by esbuild)
- `examples/**` - Example Swift files
- `tests/**` - Test files
- `*.map` - Source maps
- Development docs

Only `dist/`, `media/`, `package.json`, `README.md`, and `LICENSE` are included in the package.
