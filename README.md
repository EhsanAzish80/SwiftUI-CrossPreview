# SwiftUI-CrossPreview
A cross-platform SwiftUI-style preview engine for VS Code. Parses SwiftUI with tree-sitter, builds a layout tree, and renders it in a webview using HTML/CSS. No Mac, no Xcode, fully local. An open, extensible approach to bringing SwiftUI previews to any OS.

## Status
🚧 Early scaffold. Webview + parser IR are being wired up. Expect breaking changes.

## Features (planned MVP)
- VS Code command: `SwiftUI CrossPreview: Open Preview`
- Static SwiftUI parsing via tree-sitter
- Basic layout: VStack, HStack, ZStack, Text, Image, Spacer
- HTML/CSS-based preview panel with device presets

## Usage

1. Open a Swift file containing a SwiftUI view (e.g., `examples/HelloVStack.swift`)
2. Open the Command Palette (Cmd/Ctrl + Shift + P)
3. Run: **"SwiftUI CrossPreview: Open Preview"**
4. The preview panel will open on the right side showing your SwiftUI view rendered as HTML

## Roadmap
- Custom view inlining
- Tokamak/SwiftWasm semantic mode (optional)
- Snapshot export for docs/CI
