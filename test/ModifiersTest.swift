import SwiftUI

struct ModifiersTest: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Shadow modifier test
            Text("Card with Shadow")
                .font(.title2)
                .padding(20)
                .background(Color.white)
                .cornerRadius(12)
                .shadow(radius: 10)
            
            // Opacity test
            Text("Faded Text (50% opacity)")
                .font(.body)
                .opacity(0.5)
            
            // Blur test
            Text("Blurred Text")
                .font(.headline)
                .blur(radius: 3)
            
            // Glass material backgrounds
            VStack(spacing: 8) {
                Text("Ultra Thin Material")
                    .padding(12)
                    .background(.ultraThinMaterial)
                    .cornerRadius(8)
                
                Text("Thin Material")
                    .padding(12)
                    .background(.thinMaterial)
                    .cornerRadius(8)
                
                Text("Regular Material")
                    .padding(12)
                    .background(.regularMaterial)
                    .cornerRadius(8)
            }
            
            // Text alignment and line limit
            Text("This is a long text that demonstrates multiline text alignment to the center and a line limit of 2 lines maximum")
                .font(.callout)
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .padding(12)
                .background(Color.gray)
                .cornerRadius(8)
            
            // Stack alignment test
            HStack(alignment: .top, spacing: 12) {
                Text("Top")
                    .font(.caption)
                Text("Aligned")
                    .font(.headline)
                Text("Stack")
                    .font(.caption)
            }
            .padding(12)
            .background(Color.blue)
            .cornerRadius(8)
            
            // Combined effects - glass card with shadow
            Text("Glass Card Effect")
                .font(.headline)
                .foregroundColor(.white)
                .padding(24)
                .background(.thinMaterial)
                .cornerRadius(16)
                .shadow(radius: 12)
            
            // Overlay test
            Text("Base")
                .font(.largeTitle)
                .foregroundColor(.blue)
                .frame(width: 200, height: 100)
                .background(Color.white)
                .cornerRadius(12)
                .overlay(
                    Text("Overlay")
                        .font(.caption)
                        .foregroundColor(.red)
                )
        }
        .padding(24)
    }
}
