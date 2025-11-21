import SwiftUI

struct ButtonDemo: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Button Examples")
                .font(.title)
                .padding()
            
            Button("Tap Me") {
                print("Button tapped")
            }
            
            Button(action: {
                print("Custom action")
            }) {
                Text("Custom Button")
                    .foregroundColor(.white)
            }
            .padding()
            .background(Color.blue)
            .cornerRadius(12)
            
            Button {
                print("Another tap")
            } label: {
                HStack {
                    Text("Save")
                        .font(.headline)
                }
            }
        }
        .padding()
    }
}

struct ButtonDemo_Previews: PreviewProvider {
    static var previews: some View {
        ButtonDemo()
    }
}
