/**
 * Represents a modifier applied to a SwiftUI view
 */
export interface Modifier {
    name: string;
    args: Record<string, any>;
}

/**
 * Represents a node in the SwiftUI view tree
 */
export interface ViewNode {
    kind: "VStack" | "HStack" | "ZStack" | "Text" | "Image" | "Spacer" | "List" | "Form" | "Section" | "ForEach" | "ScrollView" | "Button" | "Toggle" | "Picker" | "LinearGradient" | "RadialGradient" | "TextField" | "SecureField" | "Rectangle" | "Circle" | "RoundedRectangle" | "Capsule" | "Ellipse" | "Divider" | "Label" | "Slider" | "Stepper" | "DatePicker" | "ColorPicker" | "ProgressView" | "Link" | "Menu" | "LazyVStack" | "LazyHStack" | "LazyVGrid" | "LazyHGrid" | "Grid" | "Group" | "GeometryReader" | "Custom";
    props: Record<string, any>;
    modifiers: Modifier[];
    children: ViewNode[];
}

/**
 * TEMP: Creates a fake ViewNode tree from text
 * Splits code into lines and creates a VStack of Text nodes
 */
export function fakeViewTreeFromText(code: string): ViewNode {
    const lines = code.split("\n").filter(l => l.trim().length > 0);
    return {
        kind: "VStack",
        props: {},
        modifiers: [],
        children: lines.map(line => ({
            kind: "Text",
            props: { text: line },
            modifiers: [],
            children: []
        }))
    };
}
