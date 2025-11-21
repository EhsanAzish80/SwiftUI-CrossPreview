# Changelog

All notable changes to the SwiftUI CrossPreview extension will be documented in this file.

## [0.0.2] - 2025-11-21

### Added
- **New Visual Modifiers**: shadow, opacity, blur, glass materials, overlay, multilineTextAlignment, lineLimit
- **Glass/Material Backgrounds**: Support for .ultraThinMaterial, .thinMaterial, .regularMaterial with backdrop blur effects
- **Stack Alignment & Spacing**: VStack(alignment: .leading, spacing: 16) parameter parsing
- **Overlay Support**: Layer content on top of base views with centered positioning
- **Text Formatting**: multilineTextAlignment and lineLimit for precise text layout
- **Xcode-Style UI**: iPhone mockup with Dynamic Island, dark background, bottom device controls
- **View Name Display**: Shows "Previewing: MyView" based on struct name
- **Comprehensive Test Files**: ModifiersTest.swift, GlassCardDemo.swift, SimpleModifiers.swift

### Changed
- Updated webview UI to match Xcode simulator appearance
- Enhanced CSS renderer with material styles and visual effects
- Improved parser to handle new modifier types in both tree-sitter and regex modes

### Fixed
- Cross-platform compatibility with regex fallback parser
- Material background detection and rendering
- Stack props handling for alignment and spacing

## [0.0.1] - Initial Release

### Added
- Live preview with auto-update (300ms debounce)
- Tree-sitter Swift parser with regex fallback
- Core SwiftUI views: VStack, HStack, ZStack, Text, Image, Spacer
- Basic modifiers: padding, foregroundColor, background, font, frame, cornerRadius
- 15 SwiftUI colors support
- 11 font styles support
- Device presets (Phone/Tablet/Desktop)
- Error UI with detailed diagnostics
- HTML/CSS renderer
- VS Code command: "SwiftUI CrossPreview: Open Preview"
