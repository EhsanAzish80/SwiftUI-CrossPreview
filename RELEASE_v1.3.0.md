# SwiftUI CrossPreview v1.3.0 Release Notes

## Navigation & App Structure Update

Version 1.3.0 adds comprehensive support for SwiftUI's navigation and app structure components, plus visual indicators for @State and @Binding properties, plus **one-click PNG export**, enabling developers to preview complex multi-screen applications with full state visualization and share crisp screenshots directly in VS Code.

---

## 🎉 What's New

### PNG Export 🎯 KILLER FEATURE

**One-click high-resolution PNG export** - the feature that takes this from "cool extension" to "tool developers rely on"!

```swift
// Preview your SwiftUI code, then click "📸 Export PNG" in the header
VStack {
    Text("Beautiful UI")
        .font(.largeTitle)
}
.padding()
.background(.ultraThinMaterial)
.cornerRadius(20)
```

**Why This Matters:**
- 📸 **Instant Screenshots** - Export preview as 2x high-res PNG with one click
- 📝 **Perfect for Docs** - Include crisp UI screenshots in documentation
- 👥 **Share with Team** - Send visual designs without building/running code
- 🎨 **Design Reviews** - Quick visual mockups for stakeholder feedback
- 📱 **Portfolio/Showcase** - Generate images for GitHub, blog posts, portfolios

**Features:**
- Header-positioned button for quick access (no hunting in menus)
- 2x resolution for crisp, professional images
- Auto-timestamped filenames (swiftui-preview-2025-01-21T14-30-45.png)
- Visual feedback: "⏳ Exporting..." → "✅ Exported!"
- Captures entire device screen with proper styling

### State Visualization ⭐ NEW

Visual badges for SwiftUI property wrappers! Now you can see which properties use @State, @Binding, and other wrappers directly in the preview.

```swift
struct CounterView: View {
    @State private var count: Int = 0
    @State private var isEnabled: Bool = true
    @Binding var username: String
    
    var body: some View {
        VStack {
            Text("Count: \\(count)")
            Toggle("Enabled", isOn: $isEnabled)
        }
    }
}
```

**Features:**
- 📦 **@State** badge - Shows State properties
- 🔗 **@Binding** badge - Shows Binding properties
- 🎯 **@StateObject** badge - Shows StateObject properties
- 👁️ **@ObservedObject** badge - Shows ObservedObject properties
- 🌍 **@EnvironmentObject** badge - Shows EnvironmentObject properties
- ⚙️ **@Environment** badge - Shows Environment properties
- **Hover tooltip** - Shows property name, type, and initial value

### Navigation Components (4 Views)

#### 1. **NavigationView** 
The classic SwiftUI navigation container with a navigation bar.

```swift
NavigationView {
    VStack {
        Text("Home")
        NavigationLink("Details") {
            Text("Detail View")
        }
    }
    .navigationTitle("Home")
}
```

**Features:**
- Navigation bar with title display
- Proper iOS-style navigation appearance
- Support for nested navigation

#### 2. **NavigationStack** (iOS 16+)
The modern stack-based navigation container.

```swift
NavigationStack {
    List {
        NavigationLink("Item 1") {
            Text("Item 1 Details")
        }
    }
    .navigationTitle("Items")
    .navigationBarTitleDisplayMode(.large)
}
```

**Features:**
- Large and inline title modes
- Toolbar support
- Modern iOS 16+ navigation patterns

#### 3. **NavigationLink**
Interactive navigation element for pushing views.

```swift
NavigationLink("View Profile") {
    ProfileView()
}
```

**Features:**
- Automatic chevron indicator
- Click/tap interaction styling
- Nested navigation support

#### 4. **NavigationSplitView**
Multi-column navigation for iPad/Mac interfaces.

```swift
NavigationSplitView {
    List {
        Text("Sidebar Item 1")
        Text("Sidebar Item 2")
    }
} detail: {
    Text("Detail View")
}
```

**Features:**
- Sidebar + detail layout
- Proper column sizing
- iPad/Mac-style interface

---

### App Structure Components

#### 5. **TabView**
Tab-based interface with bottom tab bar.

```swift
TabView {
    Text("Home")
        .tabItem {
            Label("Home", systemImage: "house.fill")
        }
    
    Text("Settings")
        .tabItem {
            Label("Settings", systemImage: "gear")
        }
        .badge(3)
}
```

**Features:**
- Interactive tab switching
- Badge support (numbers and text)
- Active tab indication
- iOS-style tab bar at bottom

---

### Content Components (3 Views)

#### 6. **AsyncImage**
Remote image loading from URLs.

```swift
AsyncImage(url: URL(string: "https://example.com/image.jpg"))
    .frame(width: 200, height: 200)
    .cornerRadius(10)
```

**Features:**
- URL-based image loading
- Placeholder for failed loads
- Full modifier support (frame, cornerRadius, etc.)

#### 7. **TextEditor**
Multi-line text input field.

```swift
TextEditor(text: "Enter your notes...")
    .frame(height: 150)
    .border(Color.gray, width: 1)
```

**Features:**
- Vertical resizing
- Placeholder support
- Native iOS/macOS styling
- Full text styling support

#### 8. **DisclosureGroup**
Expandable/collapsible content sections.

```swift
DisclosureGroup("Settings") {
    Toggle("Notifications", isOn: true)
    Toggle("Dark Mode", isOn: false)
}
```

**Features:**
- Expand/collapse animation
- Chevron indicator rotation
- Nested disclosure groups
- Perfect for settings/FAQ sections

---

## 🔧 New Modifiers (14 Modifiers)

### Navigation Modifiers (8)

- **`.navigationTitle(_:)`** - Set navigation bar title
  ```swift
  .navigationTitle("Home")
  ```

- **`.navigationBarTitleDisplayMode(_:)`** - Control title size (.large, .inline, .automatic)
  ```swift
  .navigationBarTitleDisplayMode(.large)
  ```

- **`.toolbar()`** - Add toolbar to navigation bar
  ```swift
  .toolbar()
  ```

- **`.toolbarBackground(_:)`** - Set toolbar background color
  ```swift
  .toolbarBackground(.blue)
  ```

- **`.navigationBarBackButtonHidden(_:)`** - Hide back button
  ```swift
  .navigationBarBackButtonHidden(true)
  ```

- **`.tabItem(_:)`** - Configure tab bar item
  ```swift
  .tabItem {
      Label("Home", systemImage: "house.fill")
  }
  ```

- **`.badge(_:)`** - Display badge on tab or list item
  ```swift
  .badge(5)
  .badge("New")
  ```

- **`.searchable()`** - Add search bar
  ```swift
  .searchable()
  ```

### Additional Modifiers (6)

- **`.id(_:)`** - Assign view identifier
- **`.refreshable()`** - Pull-to-refresh functionality
- **`.swipeActions()`** - Swipe gesture actions
- **`.contextMenu()`** - Long press context menu
- **`.sheet(_:)` / `.fullScreenCover(_:)`** - Modal presentations
- **`.alert(_:)`** - Alert dialogs

---

## 📊 Statistics

### Total Coverage
- **42 SwiftUI Views** (up from 34)
- **71+ Modifiers** (up from 57)
- **15 Colors** (unchanged)
- **11 Font Styles** (unchanged)

### New in v1.3.0
- **8 New Views**: NavigationView, NavigationStack, NavigationLink, NavigationSplitView, TabView, AsyncImage, TextEditor, DisclosureGroup
- **14 New Modifiers**: Navigation, tab, and interaction modifiers

---

## 🎨 Visual Enhancements

### Navigation Bar
- iOS-style navigation bar with proper title placement
- Large and inline title modes
- Back button indicators
- Toolbar support

### Tab Bar
- Bottom-aligned tab bar (iOS standard)
- Active tab highlighting with color and background
- Badge support with red notification badges
- Smooth tab switching transitions

### Disclosure Groups
- Animated chevron rotation
- Proper indentation for nested content
- iOS-style disclosure appearance
- Support for complex nested structures

### Interactive Elements
- Tab switching with click handlers
- Navigation link hover states
- Disclosure group expand/collapse
- Proper cursor styling

---

## 🧪 Test Files Included

Six comprehensive test files demonstrate all v1.3.0 features:

### 1. **NavigationDemo.swift**
- Basic NavigationView usage
- NavigationStack with large titles
- NavigationSplitView layout
- Nested navigation patterns
- Searchable navigation

### 2. **TabViewDemo.swift**
- Basic TabView with multiple tabs
- Tab badges (numbers and text)
- TabView with NavigationView integration
- Custom tab labels

### 3. **AsyncImageDemo.swift**
- Basic async image loading
- Multiple images in grids
- Styled images (circular, rounded, with shadows)
- Profile view with async image
- Image modifiers (clipShape, overlay, border)

### 4. **TextEditorDemo.swift**
- Basic text editor usage
- Styled text editors
- Note taking interface
- Comment editor view
- Multiple text editors in forms

### 5. **DisclosureGroupDemo.swift**
- Basic disclosure groups
- Nested disclosure groups
- FAQ interface
- Settings with disclosure groups
- Complex disclosure hierarchies

### 6. **CompleteAppDemo.swift**
- Full app with TabView + NavigationView
- E-commerce app demo
- Profile with AsyncImage
- Forms with TextEditor
- Settings with DisclosureGroup
- Integration of all v1.3.0 features

---

## 💡 Usage Examples

### Complete Navigation App

```swift
TabView {
    NavigationView {
        List {
            NavigationLink("Profile") {
                VStack {
                    AsyncImage(url: URL(string: "https://..."))
                        .frame(width: 120, height: 120)
                        .clipShape(Circle())
                    
                    Text("John Doe")
                        .font(.title)
                    
                    DisclosureGroup("Settings") {
                        Toggle("Notifications", isOn: true)
                        Toggle("Dark Mode", isOn: false)
                    }
                }
            }
        }
        .navigationTitle("Home")
        .searchable()
    }
    .tabItem {
        Label("Home", systemImage: "house.fill")
    }
    
    NavigationView {
        Text("Messages")
    }
    .tabItem {
        Label("Messages", systemImage: "message.fill")
    }
    .badge(5)
}
```

### Note Taking App

```swift
NavigationStack {
    VStack(alignment: .leading, spacing: 16) {
        TextField("Title", text: "Note Title")
        
        TextEditor(text: "Write your note...")
            .frame(height: 200)
            .border(Color.gray, width: 1)
        
        Button("Save") {
            // Save note
        }
    }
    .navigationTitle("New Note")
    .navigationBarTitleDisplayMode(.inline)
    .padding()
}
```

---

## 🔄 Migration from v1.2.0

All v1.2.0 features remain unchanged. Simply add the new navigation and app structure components to your SwiftUI code to take advantage of v1.3.0 features.

### Before (v1.2.0)
```swift
VStack {
    Text("Home")
    Button("Go to Details") {
        // Navigation not supported
    }
}
```

### After (v1.3.0)
```swift
NavigationView {
    VStack {
        Text("Home")
        NavigationLink("Go to Details") {
            Text("Details View")
        }
    }
    .navigationTitle("Home")
}
```

---

## 🚀 What's Next?

Potential features for future releases:
- **State Management**: @State, @Binding, @ObservedObject visualization
- **Charts**: Swift Charts support (bar, line, pie charts)
- **MapKit**: Basic map view support
- **Custom Shapes**: Path, Canvas drawing
- **Advanced Animations**: Animation curves and springs
- **More Modifiers**: confirmationDialog, toolbar items, safeAreaInset

---

## 📝 Technical Implementation

### Parser Layer
- Added 8 new parse functions in `swiftParser.ts`
- Extended `ViewNode` type system with 8 new view kinds
- Added 14 new modifier parsers
- Full closure parsing for navigation content

### Renderer Layer
- Server-side renderer updated with 8 new view cases
- Client-side renderer with matching view cases
- Tab switching JavaScript for interactive tabs
- Navigation bar HTML structure

### Styling Layer
- 250+ lines of new CSS for navigation components
- iOS-style tab bar with active states
- Navigation bar with proper title styling
- Disclosure group animations
- Async image placeholder styling

---

## 🙏 Credits

SwiftUI CrossPreview continues to provide Mac-free SwiftUI preview for developers on Windows, Linux, and macOS using VS Code. This release significantly expands coverage of real-world app patterns with navigation and tab interfaces.

---

**Install or update to v1.3.0 today and start previewing complex SwiftUI navigation flows in VS Code!**
