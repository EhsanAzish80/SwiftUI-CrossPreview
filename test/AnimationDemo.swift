import SwiftUI

struct AnimationDemo: View {
    @State private var isRotated = false
    @State private var isScaled = false
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Animation Indicators")
                .font(.title)
                .padding()
            
            // Rotation animation
            Text("Rotating Text")
                .font(.headline)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
                .rotationEffect(.degrees(isRotated ? 45 : 0))
                .animation(.easeInOut(duration: 1))
            
            // Scale animation
            Circle()
                .fill(Color.green)
                .frame(width: 100, height: 100)
                .scaleEffect(isScaled ? 1.5 : 1.0)
                .animation(.spring())
            
            // Opacity animation
            Text("Fading Text")
                .opacity(isRotated ? 0.3 : 1.0)
                .animation(.linear(duration: 0.5))
            
            // Combined animations
            RoundedRectangle(cornerRadius: 12)
                .fill(
                    LinearGradient(
                        colors: [.purple, .pink],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 150, height: 150)
                .rotationEffect(.degrees(isScaled ? 180 : 0))
                .scaleEffect(isScaled ? 0.8 : 1.0)
                .animation(.easeInOut)
            
            Text("🎬 Animation Badge Shows Animated Views")
                .font(.caption)
                .foregroundColor(.gray)
                .padding()
        }
        .padding()
    }
}

struct AnimationDemo_Previews: PreviewProvider {
    static var previews: some View {
        AnimationDemo()
    }
}
