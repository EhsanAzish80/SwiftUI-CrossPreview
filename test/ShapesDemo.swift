import SwiftUI

struct ShapesDemo: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("SwiftUI Shapes")
                .font(.title)
                .bold()
            
            HStack(spacing: 15) {
                // Rectangle
                Rectangle()
                    .fill(.blue)
                    .frame(width: 80, height: 80)
                
                // Circle
                Circle()
                    .fill(.green)
                    .frame(width: 80, height: 80)
                
                // RoundedRectangle
                RoundedRectangle(cornerRadius: 15)
                    .fill(.purple)
                    .frame(width: 80, height: 80)
            }
            
            HStack(spacing: 15) {
                // Capsule
                Capsule()
                    .fill(.orange)
                    .frame(width: 120, height: 60)
                
                // Ellipse
                Ellipse()
                    .fill(.pink)
                    .frame(width: 100, height: 60)
            }
            
            VStack(spacing: 12) {
                Text("Stroked Shapes")
                    .font(.headline)
                
                // Rectangle with stroke
                Rectangle()
                    .stroke(.red, lineWidth: 3)
                    .frame(width: 100, height: 100)
                
                // Circle with stroke
                Circle()
                    .stroke(.blue, lineWidth: 4)
                    .frame(width: 100, height: 100)
            }
            
            VStack(spacing: 12) {
                Text("Shapes with Gradients")
                    .font(.headline)
                
                RoundedRectangle(cornerRadius: 20)
                    .fill(.cyan)
                    .frame(width: 200, height: 100)
                    .shadow(radius: 8)
            }
        }
        .padding(20)
    }
}
