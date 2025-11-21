import SwiftUI

struct GradientDemo: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Gradient Examples")
                .font(.title)
                .foregroundColor(.white)
                .padding()
            
            // Linear gradient top to bottom
            LinearGradient(
                colors: [.blue, .purple],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(width: 300, height: 100)
            .cornerRadius(12)
            
            // Linear gradient diagonal
            LinearGradient(
                colors: [.red, .orange, .yellow],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .frame(width: 300, height: 100)
            .cornerRadius(12)
            
            // Radial gradient
            RadialGradient(
                colors: [.green, .blue],
                center: .center,
                startRadius: 0,
                endRadius: 100
            )
            .frame(width: 200, height: 200)
            .cornerRadius(100)
            
            // Text with gradient background
            Text("Gradient Background")
                .font(.headline)
                .foregroundColor(.white)
                .padding()
                .background(
                    LinearGradient(
                        colors: [.pink, .purple],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(8)
        }
        .padding()
    }
}

struct GradientDemo_Previews: PreviewProvider {
    static var previews: some View {
        GradientDemo()
    }
}
