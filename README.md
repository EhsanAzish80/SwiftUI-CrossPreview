# SwiftUI CrossPreview

**Live SwiftUI preview for VS Code on any platform.** No Mac, no Xcode, no simulators required.

Preview your SwiftUI code instantly with automatic updates as you type. Built with tree-sitter parser and HTML/CSS renderer.

---

## ✨ Features at a Glance

🎨 **42 SwiftUI Views** - VStack, HStack, NavigationView, TabView, AsyncImage, and more  
🔧 **71+ Modifiers** - Layout, navigation, colors, effects, typography, accessibility  
📱 **Device Mockups** - iPhone, iPad, desktop with Dynamic Island  
🔄 **Live Updates** - See changes instantly with 300ms debounce  
🎭 **Visual Effects** - Glass materials, gradients, shadows, blur, animations  
🧭 **Navigation** - Full NavigationView, NavigationStack, NavigationLink support  
📑 **Tab Interfaces** - Interactive TabView with badges  
🌐 **Remote Content** - AsyncImage for loading images from URLs  
📦 **State Visualization** - @State, @Binding, and property wrapper badges  
♿ **Accessibility** - Screen reader attributes and labels

---

## 🚀 Quick Start

### Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "SwiftUI CrossPreview"
4. Click Install

**Or install from:** [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ehsanazish.swiftui-crosspreview)

### Usage

1. Open any Swift file with SwiftUI code
2. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Run: **`SwiftUI CrossPreview: Open Preview`**
4. Your SwiftUI code renders instantly in a side panel
5. Edit your code and watch the preview update live!

---

## 📱 What You Can Preview

### Navigation & App Structure
```swift
TabView {
    NavigationView {
        List {
            NavigationLink("Profile") {
                ProfileView()
            }
        }
        .navigationTitle("Home")
    }
    .tabItem { Label("Home", systemImage: "house") }
    .badge(3)
}
```

### Visual Effects & Materials
```swift
VStack {
    Text("Glass Card")
        .font(.largeTitle)
        .foregroundColor(.white)
}
.padding(32)
.background(.ultraThinMaterial)
.cornerRadius(20)
.shadow(radius: 12)
```

### Input Controls & Forms
```swift
Form {
    TextField("Name", text: "John Doe")
    Slider(value: 0.5)
    DatePicker("Date", selection: Date())
    ColorPicker("Color", selection: .blue)
    Toggle("Enabled", isOn: true)
}
```

### Remote Content
```swift
AsyncImage(url: URL(string: "https://..."))
    .frame(width: 200, height: 200)
    .clipShape(Circle())
```

---

## 📋 Supported Features
---

## 📋 Supported Features

### Views (42 Total)

**Layouts**
- VStack, HStack, ZStack, LazyVStack, LazyHStack
- Grid, Group, GeometryReader

**Navigation & App Structure** ⭐ NEW in v1.3.0
- NavigationView, NavigationStack, NavigationLink, NavigationSplitView
- TabView with interactive tab switching

**Content** ⭐ v1.3.0 Enhanced
- Text, Image, Spacer
- AsyncImage (remote images)
- TextEditor (multi-line input)
- DisclosureGroup (expandable sections)

**Lists & Forms**
- List, Form, Section, ScrollView, ForEach

**Input Controls**
- Button, Toggle, Picker
- TextField, SecureField, TextEditor
- Slider, Stepper, DatePicker, ColorPicker

**Shapes**
- Rectangle, Circle, RoundedRectangle, Capsule, Ellipse

**Graphics**
- LinearGradient, RadialGradient

**UI Elements**
- Divider, Label, ProgressView, Link, Menu

### Modifiers (71+ Total)

**Layout & Positioning**
- `.padding()`, `.frame()`, `.offset()`, `.position()`
- `.aspectRatio()`, `.scaledToFit()`, `.scaledToFill()`
- `.clipped()`, `.clipShape()`, `.mask()`

**Navigation** ⭐ NEW in v1.3.0
- `.navigationTitle()`, `.navigationBarTitleDisplayMode()`
- `.toolbar()`, `.toolbarBackground()`
- `.navigationBarBackButtonHidden()`, `.searchable()`

**Tabs** ⭐ NEW in v1.3.0
- `.tabItem()`, `.badge()`

**Colors & Styling**
- `.foregroundColor()`, `.foregroundStyle()`, `.background()`, `.tint()`
- `.opacity()`, `.brightness()`, `.contrast()`, `.saturation()`, `.hueRotation()`

**Glass Materials**
- `.background(.ultraThinMaterial)`, `.background(.thinMaterial)`, `.background(.regularMaterial)`

**Typography**
- `.font()`, `.bold()`, `.italic()`, `.underline()`, `.strikethrough()`
- `.fontWeight()`, `.kerning()`, `.tracking()`, `.baselineOffset()`
- `.multilineTextAlignment()`, `.lineLimit()`

**Visual Effects**
- `.cornerRadius()`, `.shadow()`, `.blur()`, `.border()`

**Shapes**
- `.fill()`, `.stroke()`

**Transforms**
- `.rotationEffect()`, `.scaleEffect()`, `.offset()`

**Animation**
- `.animation()`, `.transition()`

**Interaction**
- `.onTapGesture()`, `.onLongPressGesture()`, `.disabled()`

**Additional** ⭐ NEW in v1.3.0
- `.id()`, `.refreshable()`, `.swipeActions()`, `.contextMenu()`
- `.sheet()`, `.fullScreenCover()`, `.alert()`

**Lifecycle**
- `.onAppear()`, `.onDisappear()`

**Accessibility**
- `.accessibilityLabel()`, `.accessibilityHint()`, `.accessibilityValue()`

**Layering**
- `.overlay()`

### Device Presets

- 📱 **Phone** - iPhone 15 Pro mockup with Dynamic Island (390×844)
- 📱 **Tablet** - iPad Pro (1024×1366)
- 💻 **Desktop** - Large display (1440×900)
- ⚙️ **Custom** - Set your own width × height

### Color Palette (15 Colors)

red, blue, green, yellow, purple, pink, orange, mint, teal, cyan, indigo, brown, white, gray, black

### Font Styles (11 Styles)

largeTitle, title, title2, title3, headline, body, callout, subheadline, footnote, caption, caption2

---

## 🎯 Why Use SwiftUI CrossPreview?

✅ **No Mac Required** - Preview SwiftUI on Windows, Linux, or macOS  
✅ **No Xcode** - Work entirely in VS Code  
✅ **No Simulators** - Instant rendering without heavy iOS simulators  
✅ **Fast Iteration** - See changes in 300ms  
✅ **Accurate Rendering** - Faithful to SwiftUI's visual appearance  
✅ **Complete Apps** - Preview navigation, tabs, forms, and more  
✅ **Open Source** - MIT license, community-driven

---

## 💡 Example Use Cases

### Learning SwiftUI
Perfect for developers learning SwiftUI who don't have access to a Mac or Xcode.

### Cross-Platform Development
Build SwiftUI interfaces on Windows or Linux before testing on actual devices.

### Quick Prototyping
Rapidly iterate on UI designs without waiting for Xcode builds or simulator launches.

### Documentation
Create SwiftUI code examples and see them rendered inline.

### Teaching
Demonstrate SwiftUI concepts with instant visual feedback.

---

## 🛠️ How It Works

```
Swift Code → Tree-Sitter Parser → ViewNode Tree → HTML/CSS Renderer → VS Code Webview
```

1. **Parser** - Uses tree-sitter-swift for robust AST parsing with detailed error messages
2. **ViewNode Tree** - Converts AST to internal representation of SwiftUI view hierarchy
3. **Renderer** - Generates HTML/CSS that closely matches SwiftUI's visual appearance
4. **Webview** - Displays in VS Code with live updates as you type

**Key Technologies:**
- [tree-sitter](https://tree-sitter.github.io/) - Incremental parsing
- [tree-sitter-swift](https://github.com/alex-pinkus/tree-sitter-swift) - Swift grammar
- TypeScript - Extension logic
- HTML/CSS - Visual rendering

---

## 📖 Advanced Features

### Live Update
Auto-updates preview 300ms after you stop typing. No need to save or rebuild.

### Error Diagnostics
Shows clear error messages when Swift code cannot be parsed, with line numbers and suggestions.

### Device Scaling
Smart zoom-to-fit ensures your preview always fits the available space.

### Snapshot Export
Download your preview as PNG image (coming in next release).

### Comment Support
Properly handles `//` single-line comments in SwiftUI code.

### Complex Layouts
Supports nested stacks, ForEach loops, List/Form structures, and conditional rendering.

---

## 🔄 Recent Updates

### v1.3.0 (Latest) - Navigation & App Structure
- ✨ NavigationView, NavigationStack, NavigationLink, NavigationSplitView
- ✨ TabView with interactive tab switching and badges
- ✨ AsyncImage for remote image loading
- ✨ TextEditor for multi-line text input
- ✨ DisclosureGroup for expandable content
- ✨ State visualization (@State, @Binding, @StateObject badges)
- ✨ 14 new modifiers (navigationTitle, tabItem, badge, searchable, and more)
- 📊 Now supports 42 views and 71+ modifiers

### v1.2.0 - Input Controls & Visual Effects
- Added Slider, Stepper, DatePicker, ColorPicker, ProgressView, Menu
- Lazy layouts (LazyVStack, LazyHStack, Grid)
- Color adjustments (brightness, contrast, saturation, hueRotation)
- Advanced layout modifiers

### v1.1.0 - Shapes & Gradients
- Shape views (Rectangle, Circle, RoundedRectangle, Capsule, Ellipse)
- LinearGradient and RadialGradient
- Text styling modifiers
- Animation indicators

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

**Report Bugs:** [GitHub Issues](https://github.com/EhsanAzish80/SwiftUI-CrossPreview/issues)  
**Request Features:** Open an issue with the `enhancement` label  
**Submit PRs:** Fork, code, test, and submit pull requests

**Areas for Contribution:**
- Adding more SwiftUI views and modifiers
- Improving parsing accuracy
- Enhancing visual rendering
- Documentation and examples
- Performance optimizations

---

## 📚 Documentation

- [CHANGELOG.md](CHANGELOG.md) - Release history
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
- [FEATURES_v1.3.0.md](FEATURES_v1.3.0.md) - Latest features
- [RELEASE_v1.3.0.md](RELEASE_v1.3.0.md) - v1.3.0 release notes

---

## ⚠️ Limitations

This is a **preview tool**, not a SwiftUI runtime. Some limitations:

- No actual code execution (SwiftUI logic doesn't run)
- No @State, @Binding, or other property wrappers (static preview only)
- Navigation doesn't actually navigate (shows structure only)
- Button actions don't execute
- Animations show indicators but don't animate
- Some advanced SwiftUI features not yet supported

**Best for:** Visual preview, layout exploration, learning, prototyping  
**Not for:** Debugging logic, testing interactivity, performance profiling

---

## 🗺️ Roadmap

**Upcoming Features:**
- [x] State visualization (@State, @Binding badges) ✨ NEW in v1.3.0
- [ ] Swift Charts support
- [ ] MapKit basic support  
- [ ] Custom shapes and Canvas
- [ ] Matched geometry effects
- [ ] Environment values display
- [ ] Improved animation previews

**Long-term Goals:**
- Interactive component library
- Export to Figma/Sketch
- Collaborative preview sharing
- Theme customization

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- [tree-sitter](https://tree-sitter.github.io/) - Parsing library
- [tree-sitter-swift](https://github.com/alex-pinkus/tree-sitter-swift) - Swift grammar
- Apple SwiftUI - Design inspiration
- VS Code Extension API - Platform

---

## 📞 Support

**Questions?** Open a [GitHub Discussion](https://github.com/EhsanAzish80/SwiftUI-CrossPreview/discussions)  
**Bugs?** Report an [Issue](https://github.com/EhsanAzish80/SwiftUI-CrossPreview/issues)  
**Feature Ideas?** Share in [Discussions](https://github.com/EhsanAzish80/SwiftUI-CrossPreview/discussions)

---

<div align="center">

**Made with ❤️ for the SwiftUI community**

⭐ Star us on [GitHub](https://github.com/EhsanAzish80/SwiftUI-CrossPreview) if you find this useful!

</div>
