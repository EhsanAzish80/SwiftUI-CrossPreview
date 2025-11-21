import SwiftUI

struct UIElementsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("UI Elements Demo")
                .font(.title)
                .bold()
            
            // Label examples
            VStack(alignment: .leading, spacing: 12) {
                Text("Labels")
                    .font(.headline)
                
                Label("Home", systemImage: "house")
                
                Label("Profile", systemImage: "person")
                    .foregroundColor(.blue)
                
                Label("Settings", systemImage: "gear")
                    .font(.title3)
                    .foregroundColor(.gray)
                
                Label("Download", systemImage: "arrow.down")
                    .padding(10)
                    .background(.green)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
            
            Divider()
            
            // Divider examples
            VStack(spacing: 8) {
                Text("Dividers")
                    .font(.headline)
                
                Text("Section 1")
                Divider()
                Text("Section 2")
                Divider()
                Text("Section 3")
            }
            
            Divider()
            
            // Mixed UI elements
            VStack(alignment: .leading, spacing: 10) {
                Label("Notifications", systemImage: "bell")
                    .font(.headline)
                
                Divider()
                
                HStack {
                    Label("3 new messages", systemImage: "envelope")
                        .font(.caption)
                    Spacer()
                }
                
                Divider()
                
                Label("Connected", systemImage: "wifi")
                    .foregroundColor(.green)
            }
            .padding(15)
            .background(.ultraThinMaterial)
            .cornerRadius(12)
            
            // Interactive elements
            VStack(spacing: 12) {
                Label("Tap me", systemImage: "hand.tap")
                    .padding(12)
                    .background(.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    .onTapGesture()
                
                Text("Tap gesture enabled (cursor: pointer)")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .italic()
            }
        }
        .padding(30)
    }
}
