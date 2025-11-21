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
    kind: "VStack" | "HStack" | "ZStack" | "Text" | "Image" | "Spacer" | "Custom";
    props: Record<string, any>;
    modifiers: Modifier[];
    children: ViewNode[];
}
