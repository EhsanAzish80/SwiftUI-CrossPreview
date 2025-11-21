import SwiftUI

struct HelloVStack: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("Hello, CrossPreview")
                .font(.title)
                .foregroundColor(.blue)
            Text("This is a simple VStack example.")
                .padding()
                .background(Color.yellow)
        }
        .padding()
    }
}
