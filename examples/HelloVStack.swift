import SwiftUI

struct HelloVStack: View {
    var body: some View {
        VStack {
            Text("Hello CrossPreview")
                .font(.title)
                .foregroundColor(.blue)
            
            Text("Styled text")
                .padding(16)
                .background(Color.yellow)
                .cornerRadius(8)
            
            Text("More examples")
                .foregroundColor(.green)
        }
        .frame(width: 240, height: 120)
        .padding()
    }
}
