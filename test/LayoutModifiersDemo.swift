import SwiftUI

struct LayoutModifiersDemo: View {
    var body: some View {
        VStack(spacing: 25) {
            Text("Layout Modifiers")
                .font(.title)
                .bold()
            
            // Offset modifier
            VStack(spacing: 10) {
                Text("Offset Demo")
                    .font(.headline)
                
                ZStack {
                    Rectangle()
                        .fill(.blue)
                        .frame(width: 100, height: 100)
                    
                    Rectangle()
                        .fill(.red)
                        .frame(width: 100, height: 100)
                        .offset(x: 30, y: 30)
                    
                    Text("Overlapped")
                        .foregroundColor(.white)
                        .bold()
                        .offset(x: 15, y: 15)
                }
            }
            
            Divider()
            
            // Border modifier
            VStack(spacing: 10) {
                Text("Border Examples")
                    .font(.headline)
                
                HStack(spacing: 15) {
                    Text("Blue Border")
                        .padding(10)
                        .border(.blue, width: 2)
                    
                    Text("Red Border")
                        .padding(10)
                        .border(.red, width: 3)
                    
                    Text("Green Border")
                        .padding(10)
                        .border(.green, width: 1)
                }
            }
            
            Divider()
            
            // Clipped modifier
            VStack(spacing: 10) {
                Text("Clipped Content")
                    .font(.headline)
                
                Text("This is a very long text that should be clipped when it exceeds the frame boundaries")
                    .frame(width: 150, height: 40)
                    .background(.yellow)
                    .clipped()
            }
            
            // Combination of modifiers
            Text("Combined Layout")
                .bold()
                .padding(15)
                .background(.purple)
                .foregroundColor(.white)
                .cornerRadius(10)
                .border(.pink, width: 3)
                .shadow(radius: 5)
                .offset(x: 0, y: 5)
        }
        .padding(30)
    }
}
