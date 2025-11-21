import SwiftUI

struct ComprehensiveDemo: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 25) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("SwiftUI CrossPreview")
                        .font(.largeTitle)
                        .bold()
                    
                    Text("Comprehensive Feature Demo")
                        .font(.title3)
                        .foregroundColor(.gray)
                        .italic()
                }
                
                Divider()
                
                // Form section
                VStack(alignment: .leading, spacing: 12) {
                    Label("User Information", systemImage: "person")
                        .font(.headline)
                    
                    TextField("Full Name")
                        .padding(12)
                        .background(.white)
                        .cornerRadius(8)
                        .border(.gray, width: 1)
                    
                    TextField("Email")
                        .padding(12)
                        .background(.white)
                        .cornerRadius(8)
                        .border(.blue, width: 1)
                    
                    SecureField("Password")
                        .padding(12)
                        .background(.white)
                        .cornerRadius(8)
                        .border(.red, width: 1)
                }
                .padding(15)
                .background(.ultraThinMaterial)
                .cornerRadius(12)
                
                Divider()
                
                // Shapes section
                VStack(alignment: .leading, spacing: 12) {
                    Text("Shapes & Graphics")
                        .font(.headline)
                    
                    HStack(spacing: 10) {
                        Circle()
                            .fill(.blue)
                            .frame(width: 60, height: 60)
                            .shadow(radius: 4)
                        
                        Rectangle()
                            .fill(.green)
                            .frame(width: 60, height: 60)
                            .cornerRadius(8)
                        
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(.purple, lineWidth: 3)
                            .frame(width: 60, height: 60)
                        
                        Capsule()
                            .fill(.orange)
                            .frame(width: 80, height: 40)
                    }
                }
                
                Divider()
                
                // Text styling
                VStack(alignment: .leading, spacing: 8) {
                    Text("Text Styling Options")
                        .font(.headline)
                    
                    Text("Bold and important")
                        .bold()
                    
                    Text("Subtle italic note")
                        .italic()
                        .foregroundColor(.gray)
                    
                    Text("Underlined link")
                        .underline()
                        .foregroundColor(.blue)
                    
                    Text("Completed task")
                        .strikethrough()
                        .foregroundColor(.gray)
                }
                
                Divider()
                
                // Interactive elements
                VStack(spacing: 10) {
                    Text("Interactive Elements")
                        .font(.headline)
                    
                    Button {
                        Text("Primary Action")
                            .bold()
                    }
                    .padding(12)
                    .background(.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    .onTapGesture()
                    
                    Label("Tap for details", systemImage: "info")
                        .padding(10)
                        .background(.thinMaterial)
                        .cornerRadius(8)
                        .onTapGesture()
                }
                
                Divider()
                
                // Layout modifiers
                VStack(alignment: .leading, spacing: 10) {
                    Text("Advanced Layout")
                        .font(.headline)
                    
                    ZStack {
                        Rectangle()
                            .fill(.yellow)
                            .frame(width: 100, height: 100)
                            .opacity(0.7)
                        
                        Text("Offset")
                            .bold()
                            .offset(x: 20, y: 20)
                            .foregroundColor(.black)
                    }
                    .clipped()
                }
                
                // Footer
                Text("All features working! ✨")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .italic()
                    .padding(.top, 20)
            }
            .padding(30)
        }
    }
}
