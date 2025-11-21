# SwiftUI CrossPreview v1.1.0 - New Features

## Overview
Version 1.1.0 adds extensive support for additional SwiftUI views and modifiers, significantly expanding the capability of SwiftUI CrossPreview.

---

## New Views Added (8 types)

### Input Controls
- **TextField** - Text input field with placeholder support
- **SecureField** - Password input field (masked text)

### Shapes (5 types)
- **Rectangle** - Basic rectangular shape
- **Circle** - Perfect circular shape
- **RoundedRectangle** - Rectangle with customizable corner radius
- **Capsule** - Pill-shaped container (fully rounded ends)
- **Ellipse** - Oval/ellipse shape

### UI Elements
- **Divider** - Horizontal separator line
- **Label** - Icon + text combination (supports systemImage parameter)

---

## New Modifiers Added (13 modifiers)

### Text Styling (4 modifiers)
- **.bold()** - Makes text bold
- **.italic()** - Makes text italic
- **.underline()** - Underlines text
- **.strikethrough()** - Adds strikethrough to text

### Layout & Positioning (3 modifiers)
- **.offset(x:y:)** - Moves view by x/y pixels
- **.border(_:width:)** - Adds colored border with custom width
- **.clipped()** - Clips content to view bounds

### Shape Styling (2 modifiers)
- **.fill(_:)** - Fills shapes with color
- **.stroke(_:lineWidth:)** - Strokes shape outline with color and width

### Interaction (1 modifier)
- **.onTapGesture()** - Marks view as tappable (adds pointer cursor)

---

## Implementation Details

### Parser Updates
**File: `src/parser/viewTree.ts`**
- Updated ViewNode type to include 8 new view kinds

**File: `src/parser/swiftParser.ts`**
- Added `parseTextField()` - Extracts placeholder text
- Added `parseRoundedRectangle()` - Parses cornerRadius parameter
- Added `parseLabel()` - Extracts title and systemImage
- Shape parsers for Rectangle, Circle, Capsule, Ellipse, Divider
- Regex fallback support for all new views
- Modifier argument parsing for offset, border, fill, stroke

### Renderer Updates
**File: `src/renderer/renderHtml.ts`**
- TextField renders as `<input type="text">` with iOS styling
- SecureField renders as `<input type="password">`
- Shapes render as `<div>` with appropriate CSS classes
- Divider renders as 1px gray line
- Label renders as flex container with icon + text
- All new modifiers supported in `buildStyle()` function

**File: `src/extension.ts`**
- Added CSS classes for all new views:
  - `.textfield` / `.securefield` - Input field styling with focus states
  - `.shape`, `.rectangle`, `.circle`, `.rounded-rectangle`, `.capsule`, `.ellipse` - Shape styling
  - `.divider` - Separator styling
  - `.label`, `.label-icon`, `.label-text` - Label component styling
- Client-side JavaScript rendering mirrors server-side
- All new modifiers supported in client buildStyle() function

---

## Test Files Created

1. **TextFieldDemo.swift** - Demonstrates TextField and SecureField
2. **ShapesDemo.swift** - All 5 shape types with fill and stroke
3. **TextStylingDemo.swift** - Bold, italic, underline, strikethrough examples
4. **LayoutModifiersDemo.swift** - Offset, border, clipped examples
5. **UIElementsDemo.swift** - Label and Divider usage
6. **ComprehensiveDemo.swift** - Combined demo of all new features

---

## Usage Examples

### TextField & SecureField
```swift
TextField("Enter your name")
    .padding(12)
    .border(.blue, width: 2)
    .cornerRadius(8)

SecureField("Password")
    .padding(12)
    .background(.ultraThinMaterial)
```

### Shapes
```swift
Circle()
    .fill(.blue)
    .frame(width: 80, height: 80)

RoundedRectangle(cornerRadius: 15)
    .stroke(.red, lineWidth: 3)
    .frame(width: 100, height: 100)

Capsule()
    .fill(.orange)
    .frame(width: 120, height: 60)
```

### Text Styling
```swift
Text("Bold and important")
    .bold()

Text("Subtle italic note")
    .italic()
    .foregroundColor(.gray)

Text("Underlined link")
    .underline()
    .foregroundColor(.blue)
```

### Layout Modifiers
```swift
Text("Offset text")
    .offset(x: 20, y: 10)

Text("With border")
    .padding(10)
    .border(.red, width: 2)

Text("Clipped content")
    .frame(width: 100)
    .clipped()
```

### UI Elements
```swift
Label("Home", systemImage: "house")

Label("Settings", systemImage: "gear")
    .foregroundColor(.blue)

Divider()
```

---

## Coverage Summary

**Total Views Supported: 23**
- Layouts: VStack, HStack, ZStack
- Content: Text, Image, Spacer
- Lists: List, Form, Section, ScrollView, ForEach
- Controls: Button, Toggle, Picker, TextField, SecureField
- Shapes: Rectangle, Circle, RoundedRectangle, Capsule, Ellipse
- Graphics: LinearGradient, RadialGradient
- UI Elements: Divider, Label

**Total Modifiers Supported: 30+**
- Layout: padding, frame, offset
- Colors: foregroundColor, background
- Glass: ultraThinMaterial, thinMaterial, regularMaterial
- Typography: font, bold, italic, underline, strikethrough, multilineTextAlignment, lineLimit
- Visual: cornerRadius, shadow, opacity, blur, border, clipped
- Shapes: fill, stroke
- Transform: rotationEffect, scaleEffect, offset
- Animation: animation (with 🎬 badge)
- Interaction: onTapGesture
- Layering: overlay

---

## Breaking Changes
None. All changes are additive and backwards compatible.

---

## Next Steps
Potential future additions based on user feedback:
- NavigationView / NavigationLink
- LazyVStack / LazyVGrid (performance optimization)
- TabView (tab-based navigation)
- Slider / Stepper (numeric input)
- GeometryReader (responsive layouts)
- More gesture handlers (.onLongPressGesture, etc.)

---

## Build Status
✅ Successfully compiled
✅ All test files created
✅ Documentation updated
✅ Ready for release
