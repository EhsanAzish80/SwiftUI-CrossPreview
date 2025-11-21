# SwiftUI CrossPreview

**Cross-platform SwiftUI preview engine for VS Code.** Parses SwiftUI with tree-sitter, builds a layout tree, and renders an approximate UI in a webview using HTML/CSS — no Mac, no Xcode required.

---

## Status

✅ **Live SwiftUI-style preview with auto-update is now working.**

---

## Features

- **Live preview with auto-update** (300ms debounce) — edit your Swift code and see instant changes
- **AST-based parsing** using tree-sitter-swift with detailed error messages
- **34 SwiftUI views supported**: Including VStack, HStack, ZStack, LazyVStack, LazyHStack, Grid, List, Form, TextField, Slider, Stepper, DatePicker, ColorPicker, ProgressView, Menu, and more
- **57+ modifiers supported**: Layout, typography, colors, visual effects, animations, interactions, accessibility, and more
- **Rich visual effects**: Glass materials, gradients, shadows, blur, brightness, contrast, saturation, hue rotation
- **Input controls**: TextField, SecureField, Slider, Stepper, DatePicker, ColorPicker with native styling
- **Stack alignment & spacing**: VStack(alignment: .leading, spacing: 16) with full control
- **15 SwiftUI colors**: red, blue, green, yellow, purple, pink, orange, mint, teal, cyan, indigo, brown, white, gray, black
- **11 font styles**: largeTitle, title, title2, title3, headline, body, callout, subheadline, footnote, caption, caption2
- **Device presets** (Phone/Tablet/Desktop/Custom) with iPhone-style mockup and Dynamic Island
- **Glass/material backgrounds**: .ultraThinMaterial, .thinMaterial, .regularMaterial with backdrop blur
- **Accessibility support**: accessibilityLabel, accessibilityHint, accessibilityValue for screen readers
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
- **Layouts**: VStack, HStack, ZStack, LazyVStack, LazyHStack, Grid, Group, GeometryReader
- **Content**: Text, Image, Spacer
- **Lists**: List, Form, Section, ScrollView, ForEach
- **Controls**: Button, Toggle, Picker, TextField, SecureField, Slider, Stepper, DatePicker, ColorPicker
- **Shapes**: Rectangle, Circle, RoundedRectangle, Capsule, Ellipse
- **Graphics**: LinearGradient, RadialGradient
- **UI Elements**: Divider, Label, ProgressView, Link, Menu

**Supported Modifiers:**
- **Layout**: `.padding()`, `.frame(width:height:)`, `.offset(x:y:)`, `.position(x:y:)`, `.aspectRatio(_:contentMode:)`, `.clipped()`
- **Image Scaling**: `.scaledToFit()`, `.scaledToFill()`
- **Colors**: `.foregroundColor()`, `.foregroundStyle()`, `.background()`, `.tint()`
- **Glass**: `.background(.ultraThinMaterial/.thinMaterial/.regularMaterial)`
- **Typography**: `.font()`, `.bold()`, `.italic()`, `.underline()`, `.strikethrough()`, `.fontWeight()`, `.kerning()`, `.tracking()`, `.baselineOffset()`, `.multilineTextAlignment()`, `.lineLimit()`
- **Visual**: `.cornerRadius()`, `.shadow()`, `.opacity()`, `.blur()`, `.border()`, `.clipShape()`, `.mask()`
- **Color Adjust**: `.brightness()`, `.contrast()`, `.saturation()`, `.hueRotation()`
- **Shapes**: `.fill()`, `.stroke()`
- **Transform**: `.rotationEffect()`, `.scaleEffect()`, `.offset()`
- **Animation**: `.animation()`, `.transition()`
- **Interaction**: `.onTapGesture()`, `.onLongPressGesture()`, `.disabled()`
- **Lifecycle**: `.onAppear()`, `.onDisappear()`
- **Accessibility**: `.accessibilityLabel()`, `.accessibilityHint()`, `.accessibilityValue()`
- **Layering**: `.overlay()`

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
- [x] List, Form, Section, ScrollView
- [x] ForEach support (ranges & arrays)
- [x] Zoom-to-fit device scaling
- [x] Comment support (// comments)
- [x] Button, Toggle, Picker
- [x] Gradient backgrounds (LinearGradient, RadialGradient)
- [x] Animation indicators (.animation modifier badge)
- [x] Custom device sizes (width × height input)
- [x] Snapshot export (PNG download)
- [x] Input fields (TextField, SecureField, Slider, Stepper, DatePicker, ColorPicker)
- [x] Shape views (Rectangle, Circle, RoundedRectangle, Capsule, Ellipse)
- [x] UI elements (Divider, Label, ProgressView, Link, Menu)
- [x] Lazy layouts (LazyVStack, LazyHStack, Grid, Group, GeometryReader)
- [x] Text styling (.bold, .italic, .underline, .strikethrough, .fontWeight, .kerning, .tracking)
- [x] Advanced layout (.offset, .position, .aspectRatio, .scaledToFit/Fill, .clipShape, .mask)
- [x] Color adjustments (.brightness, .contrast, .saturation, .hueRotation)
- [x] Interaction (.onTapGesture, .onLongPressGesture, .disabled)
- [x] Lifecycle hooks (.onAppear, .onDisappear)
- [x] Transitions and accessibility (.transition, .accessibilityLabel/Hint/Value)

---

## How to Give Feedback

We'd love to hear from you! If you encounter bugs, have feature requests, or want to contribute:

**Report Issues:** [GitHub Issues](https://github.com/EhsanAzish80/SwiftUI-CrossPreview/issues)

**Labels:**
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `parser` - Issues with Swift/SwiftUI parsing
- `renderer` - Issues with HTML/CSS rendering
- `documentation` - Documentation improvements

**Feature Requests:** Open an issue with the `enhancement` label and describe your use case!

---

## License

MIT

---

## Credits

Built with [tree-sitter](https://tree-sitter.github.io/) and [tree-sitter-swift](https://github.com/alex-pinkus/tree-sitter-swift).
