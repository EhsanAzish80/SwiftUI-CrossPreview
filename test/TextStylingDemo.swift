import SwiftUI

struct TextStylingDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Text Styling Examples")
                .font(.largeTitle)
                .bold()
            
            // Bold text
            Text("This text is bold")
                .bold()
            
            // Italic text
            Text("This text is italic")
                .italic()
            
            // Underlined text
            Text("This text is underlined")
                .underline()
            
            // Strikethrough text
            Text("This text has strikethrough")
                .strikethrough()
            
            // Combined styles
            Text("Bold and Italic")
                .bold()
                .italic()
                .foregroundColor(.blue)
            
            Text("Underlined and Bold")
                .bold()
                .underline()
                .foregroundColor(.purple)
            
            // With other modifiers
            Text("Styled with background")
                .bold()
                .italic()
                .padding(12)
                .background(.yellow)
                .cornerRadius(8)
            
            // In different font sizes
            VStack(alignment: .leading, spacing: 8) {
                Text("Large Bold Title")
                    .font(.title)
                    .bold()
                
                Text("Regular italic body text")
                    .font(.body)
                    .italic()
                
                Text("Small underlined caption")
                    .font(.caption)
                    .underline()
            }
            
            Divider()
            
            Text("Note: Text decoration can be combined with other modifiers like colors, backgrounds, and shadows")
                .font(.footnote)
                .foregroundColor(.gray)
                .italic()
        }
        .padding(30)
    }
}
