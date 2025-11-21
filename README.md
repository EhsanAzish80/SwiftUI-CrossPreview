# SwiftUI-CrossPreview
A cross-platform SwiftUI preview engine for VS Code. Parses SwiftUI with tree-sitter, builds a layout tree, and renders it in a webview using HTML/CSS. No Mac, no Xcode, fully local. An open, extensible approach to bringing SwiftUI previews to any OS.

## Status
✅ **Live preview with auto-update now working!**

The extension now features:
- **Live editing**: Edit your Swift file and see instant updates (300ms debounce)
- **Tree-sitter parsing**: Robust AST-based Swift parsing with detailed error messages
- **Error UI**: Red error banner showing parse failures with specific diagnostics
- **Status indicator**: Live timestamp showing last update time

## Features

### Currently Working
- ✅ **Live Auto-Update** - Preview updates automatically as you type (300ms debounce)
- ✅ **Device Presets** - Phone (390px), Tablet (768px), Desktop (1024px)
- ✅ **Device Frame** - Animated transitions with drop shadow
- ✅ **Tree-sitter Swift Parser** - Robust AST-based parsing with detailed error messages
- ✅ **Full Modifier Support** - padding, foregroundColor, background, font, frame, cornerRadius
- ✅ **15 SwiftUI Colors** - red, blue, green, yellow, purple, pink, and more
- ✅ **11 Font Styles** - largeTitle, title, body, caption, and more
- ✅ **Error UI** - Red error banner showing parse failures with specific diagnostics
- ✅ **VS Code Command** - `SwiftUI CrossPreview: Open Preview`
- ✅ **View Support** - VStack, HStack, ZStack, Text, Image, Spacer
- ✅ **HTML/CSS Renderer** - Converts ViewNode tree to styled HTML with inline CSS
- ✅ **Dark Theme** - Matches VS Code aesthetic
- ✅ **Live Status** - Shows last update timestamp

### Supported SwiftUI Pattern
```swift
struct MyView: View {
    var body: some View {
        VStack {
            Text("Hello CrossPreview")
                .font(.title)
                .foregroundColor(.blue)
            
            Text("Styled text")
                .padding(16)
                .background(Color.yellow)
                .cornerRadius(8)
        }
        .frame(width: 240, height: 120)
        .padding()
    }
}
```

**Supported Modifiers:**
- `.padding()` and `.padding(N)`
- `.foregroundColor(.color)` - 15 colors
- `.background(Color.color)` - 15 colors
- `.font(.style)` - 11 font styles
- `.frame(width: N, height: N)`
- `.cornerRadius(N)`

## Usage

1. Open a Swift file containing a SwiftUI view (e.g., `examples/HelloVStack.swift`)
2. Open the Command Palette (Cmd/Ctrl + Shift + P)
3. Run: **"SwiftUI CrossPreview: Open Preview"**
4. The preview panel opens on the right showing your rendered SwiftUI view
5. **Select device preset:** Click Phone, Tablet, or Desktop in the toolbar
6. **Edit your Swift code** - the preview updates automatically!
7. If parsing fails, a red error banner explains what went wrong

## Development

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Run in Extension Development Host
# Press F5 in VS Code
```

## Architecture

```
Swift Source Code
    ↓
tree-sitter Parser (parser/swiftParser.ts)
    ↓
ViewNode Tree (parser/viewTree.ts)
    ↓
HTML Renderer (renderer/renderHtml.ts)
    ↓
Webview Display (media/preview.html)
```

## Roadmap
- [ ] More view types (Button, List, ScrollView)
- [ ] More modifiers (opacity, shadow, offset, rotation, alignment)
- [ ] Spacing parameters for stacks
- [ ] Device frame presets ✅ (completed)
- [ ] Custom device sizes and orientations
- [ ] Custom view inlining
- [ ] Tokamak/SwiftWasm semantic mode (optional)
- [ ] Snapshot export for docs/CI

## Packaging

```bash
npm install -g @vscode/vsce
npm run compile
npm run package
```

This creates a `.vsix` file that can be installed locally or published to the VS Code Marketplace. See `DEVELOPMENT.md` for full packaging instructions.
