# Release Instructions for v1.0.0

## Steps to Complete the Release

### 1. Commit Changes
```bash
git add -A
git commit -m "Release v1.0.0 - List/Form/ForEach support, zoom-to-fit, comments"
```

### 2. Create Git Tag
```bash
git tag -a v1.0.0 -m "Version 1.0.0

Major features:
- List, Form, Section, ScrollView, ForEach support
- Comment support (// single-line comments)
- Zoom-to-fit device scaling
- Fixed device dimensions
- Scrollable containers
- Improved VStack/ForEach parsing"
```

### 3. Push to GitHub
```bash
git push origin main
git push origin v1.0.0
```

### 4. Create GitHub Release
1. Go to: https://github.com/EhsanAzish80/SwiftUI-CrossPreview/releases/new
2. Choose tag: `v1.0.0`
3. Release title: `v1.0.0 - List, Form, ForEach Support`
4. Description:

```markdown
## 🎉 Version 1.0.0 - Major Feature Release

### ✨ New Features

**Container Views & Iteration**
- ✅ **List** - iOS-style list with white background and scrolling
- ✅ **Form** - Form container with proper styling
- ✅ **Section** - Grouped sections with headers
- ✅ **ScrollView** - Scrollable content container
- ✅ **ForEach** - Support for `ForEach(1..<4)` and `ForEach(["items"])` patterns

**Enhanced Experience**
- 🔍 **Zoom-to-fit** - Device mockup automatically scales to window size
- 📐 **Fixed dimensions** - Device sizes stay constant (iPhone: 430×880, iPad: 820×1100)
- 📜 **Scrollable content** - List/Form/ScrollView scroll when content exceeds height
- 💬 **Comment support** - `//` comments are properly handled
- 🎨 **System gray background** - iOS-style preview area background

### 🐛 Bug Fixes
- Fixed ForEach preventing sibling elements from rendering
- VStack now properly displays all children vertically
- Frame modifier only affects content, not device dimensions
- Improved nested structure parsing (VStack > List > ForEach)

### 📦 What's Changed
- Updated to v1.0.0 stable release
- Enhanced parser for complex SwiftUI patterns
- Better CSS rendering for container views
- Improved device mockup scaling

### 🚀 Try It Now
```swift
VStack {
    Text("Hello World")
        .font(.title)
    
    List {
        ForEach(1..<5) { index in
            Text("Item \(index)")
                .padding()
        }
    }
}
.frame(width: 300, height: 400)
```

**Full Changelog**: https://github.com/EhsanAzish80/SwiftUI-CrossPreview/blob/main/CHANGELOG.md
```

5. Attach the packaged `.vsix` file if you have it
6. Click "Publish release"

### 5. Publish to VS Code Marketplace (Optional)
```bash
npm run package  # Creates swiftui-crosspreview-1.0.0.vsix
npm run publish  # Publishes to marketplace
```

## Summary of Changes

### Files Modified:
- ✅ `package.json` - Updated version to 1.0.0
- ✅ `README.md` - Added feedback section, updated features list
- ✅ `CHANGELOG.md` - Added v1.0.0 release notes
- ✅ `src/parser/swiftParser.ts` - Fixed ForEach parsing, added comment support
- ✅ `src/extension.ts` - Added zoom-to-fit, fixed backgrounds, moved device menu
- ✅ `src/renderer/renderHtml.ts` - Added List/Form/Section/ScrollView/ForEach rendering

### New Features Implemented:
1. List, Form, Section, ScrollView views
2. ForEach with range and array support
3. Comment stripping (// comments)
4. Zoom-to-fit device scaling
5. Scrollable container behavior
6. System gray background theme

All documentation and code is ready for the v1.0.0 release! 🎉
