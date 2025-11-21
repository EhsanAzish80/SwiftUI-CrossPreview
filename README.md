# SwiftUI CrossPreview

**Cross-platform SwiftUI preview engine for VS Code.** Parses SwiftUI with tree-sitter, builds a layout tree, and renders an approximate UI in a webview using HTML/CSS — no Mac, no Xcode required.

---

## Status

✅ **Live SwiftUI-style preview with auto-update is now working.**

---

## Features

- **Live preview with auto-update** (300ms debounce) — edit your Swift code and see instant changes
- **AST-based parsing** using tree-sitter-swift with detailed error messages
- **Core SwiftUI support**: VStack, HStack, ZStack, Text, Image, Spacer
- **Rich modifiers**: padding, foregroundColor, background, font, frame, cornerRadius, shadow, opacity, blur, glass materials, overlay, multilineTextAlignment, lineLimit
- **Stack alignment & spacing**: VStack(alignment: .leading, spacing: 16)
- **15 SwiftUI colors**: red, blue, green, yellow, purple, pink, orange, mint, teal, cyan, indigo, brown, white, gray, black
- **11 font styles**: largeTitle, title, title2, title3, headline, body, callout, subheadline, footnote, caption, caption2
- **Device presets** (Phone/Tablet/Desktop) with iPhone-style mockup and Dynamic Island
- **Glass/material backgrounds**: .ultraThinMaterial, .thinMaterial, .regularMaterial with backdrop blur
- **HTML/CSS renderer** with dark VS Code-themed UI, shadows, and modern visual effects
- **Command**: `SwiftUI CrossPreview: Open Preview`

---

## Supported SwiftUI Example

```swift
import SwiftUI

struct GlassCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Welcome")
                .font(.largeTitle)
                .foregroundColor(.white)
            
            Text("SwiftUI CrossPreview")
                .font(.headline)
                .foregroundColor(.blue)
                .padding(16)
                .background(.thinMaterial)
                .cornerRadius(12)
                .shadow(radius: 8)
            
            HStack(alignment: .center, spacing: 12) {
                Text("Live")
                    .opacity(0.7)
                Text("Preview")
                    .font(.caption)
            }
        }
        .padding(32)
    }
}
```

**Supported Views:**
- VStack, HStack, ZStack (with alignment & spacing parameters)
- Text, Image, Spacer

**Supported Modifiers:**
- Layout: `.padding()`, `.padding(N)`, `.frame(width:height:)`
- Colors: `.foregroundColor(.color)`, `.background(Color.color)`
- Glass: `.background(.ultraThinMaterial)`, `.background(.thinMaterial)`, `.background(.regularMaterial)`
- Typography: `.font(.style)`, `.multilineTextAlignment(.center)`, `.lineLimit(N)`
- Visual: `.cornerRadius(N)`, `.shadow(radius:)`, `.opacity(N)`, `.blur(radius:)`
- Layering: `.overlay(Content)`

---

## Usage

1. **Open a Swift file** containing a SwiftUI view (e.g., `MyView.swift`)
2. **Open Command Palette** (Cmd/Ctrl + Shift + P)
3. Run: **`SwiftUI CrossPreview: Open Preview`**
4. **Select device**: Click Phone, Tablet, or Desktop in the bottom bar
5. **Edit your Swift code** — the preview updates automatically!
6. **Error handling**: If parsing fails, an error banner shows diagnostics

---

## Implementation / Architecture

```
Swift source → tree-sitter parser → ViewNode tree → HTML/CSS renderer → VS Code webview
```

**Key files:**
- [`src/parser/swiftParser.ts`](src/parser/swiftParser.ts) - Tree-sitter Swift parser with regex fallback
- [`src/parser/viewTree.ts`](src/parser/viewTree.ts) - ViewNode data structure
- [`src/renderer/renderHtml.ts`](src/renderer/renderHtml.ts) - HTML/CSS generator
- [`src/extension.ts`](src/extension.ts) - VS Code extension entry point with webview UI

---

## Development

```bash
# Clone the repository
git clone https://github.com/EhsanAzish80/SwiftUI-CrossPreview.git
cd SwiftUI-CrossPreview

# Install dependencies
npm install

# Build extension
npm run build

# Run in Extension Development Host
# Press F5 in VS Code to launch debug session

# Package for distribution
npm run package
```

---

## Roadmap

- [x] Live preview with auto-update
- [x] Tree-sitter Swift parser
- [x] Core SwiftUI views & modifiers
- [x] Device presets with iPhone mockup
- [x] Glass materials & visual effects
- [x] Stack alignment & spacing
- [ ] Button, List, ScrollView
- [ ] Gradient backgrounds
- [ ] Animation indicators
- [ ] Custom device sizes
- [ ] Snapshot export

---

## License

MIT

---

## Credits

Built with [tree-sitter](https://tree-sitter.github.io/) and [tree-sitter-swift](https://github.com/alex-pinkus/tree-sitter-swift).
