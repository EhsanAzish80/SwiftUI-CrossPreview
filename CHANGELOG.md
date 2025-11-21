# Changelog

All notable changes to the SwiftUI CrossPreview extension will be documented in this file.

## [1.0.0] - 2025-11-21

### Added
- **List, Form, Section, ScrollView support** - Full container view rendering with automatic scrolling
- **ForEach support** - Parses range patterns (`1..<4`) and array literals (`["One", "Two"]`) with template expansion
- **Comment support** - Single-line `//` comments are now properly handled and stripped during parsing
- **Zoom-to-fit scaling** - Device mockup automatically scales to fit VS Code window size
- **Fixed device dimensions** - Device mockup sizes remain constant regardless of content (430×880 phone, 820×1100 tablet, 1024×768 desktop)
- **Scrollable containers** - List/Form/ScrollView automatically become scrollable when content exceeds height
- **System gray background** - Extension preview area uses iOS-style system gray background (#f2f2f7)
- **Device menu moved to top** - Better UI layout with device selector positioned above mockup

### Fixed
- ForEach no longer prevents sibling Text elements from rendering
- VStack now properly displays all children vertically with correct spacing
- Frame modifier only affects content width/height, not device mockup dimensions
- Improved regex fallback parser with proper child node parsing
- Text nodes before and after ForEach now render correctly

### Changed
- Updated device screen background to white for better content visibility
- Improved parsing logic to handle complex nested structures (VStack > List > ForEach)
- Enhanced CSS for better list and form rendering with proper flex layouts
- Device mockup uses CSS transforms for zoom instead of changing dimensions

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
