import SwiftUI

struct SimpleModifiers: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Shadow Effect")
                .padding(16)
                .background(Color.white)
                .cornerRadius(8)
                .shadow(radius: 8)
            
            Text("Glass Material")
                .padding(16)
                .background(.thinMaterial)
                .cornerRadius(8)
            
            Text("Faded (opacity 0.5)")
                .opacity(0.5)
            
            Text("Blurred Text")
                .blur(radius: 2)
        }
        .padding(20)
    }
}
