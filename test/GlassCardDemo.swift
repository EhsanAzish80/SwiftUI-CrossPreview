import SwiftUI

struct GlassCardDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Text("Glass Card Gallery")
                .font(.largeTitle)
                .foregroundColor(.white)
            
            // Glass card with shadow
            VStack(alignment: .leading, spacing: 12) {
                Text("Premium Card")
                    .font(.headline)
                    .foregroundColor(.white)
                
                Text("This card combines glass material, shadow, and custom spacing")
                    .font(.callout)
                    .foregroundColor(.white)
                    .opacity(0.8)
                    .multilineTextAlignment(.leading)
                    .lineLimit(3)
            }
            .padding(20)
            .background(.thinMaterial)
            .cornerRadius(16)
            .shadow(radius: 12)
            
            // Horizontal card row
            HStack(alignment: .top, spacing: 16) {
                VStack(spacing: 8) {
                    Text("Card 1")
                        .font(.headline)
                    Text("Details")
                        .font(.caption)
                        .opacity(0.7)
                }
                .padding(16)
                .background(.ultraThinMaterial)
                .cornerRadius(12)
                .shadow(radius: 6)
                
                VStack(spacing: 8) {
                    Text("Card 2")
                        .font(.headline)
                    Text("Details")
                        .font(.caption)
                        .opacity(0.7)
                }
                .padding(16)
                .background(.ultraThinMaterial)
                .cornerRadius(12)
                .shadow(radius: 6)
            }
            
            // Badge overlay example
            Text("Featured")
                .font(.title2)
                .foregroundColor(.blue)
                .frame(width: 200, height: 80)
                .background(Color.white)
                .cornerRadius(12)
                .shadow(radius: 8)
                .overlay(
                    Text("NEW")
                        .font(.caption)
                        .foregroundColor(.red)
                )
            
            // Blurred background element
            Text("Background Element")
                .font(.body)
                .padding(12)
                .background(Color.gray)
                .cornerRadius(8)
                .blur(radius: 4)
                .opacity(0.3)
        }
        .padding(32)
    }
}
