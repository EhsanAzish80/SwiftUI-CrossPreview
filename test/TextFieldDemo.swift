import SwiftUI

struct TextFieldDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Form Input Demo")
                .font(.title)
                .bold()
            
            // Regular TextField
            TextField("Enter your name")
                .padding(12)
                .border(.gray, width: 1)
                .cornerRadius(8)
            
            // SecureField for passwords
            SecureField("Enter password")
                .padding(12)
                .border(.blue, width: 2)
                .cornerRadius(8)
            
            // TextField with custom styling
            TextField("Email address")
                .padding(15)
                .background(.ultraThinMaterial)
                .cornerRadius(10)
                .shadow(radius: 4)
            
            // TextField in a form context
            VStack(alignment: .leading, spacing: 8) {
                Text("Username")
                    .font(.caption)
                    .foregroundColor(.gray)
                
                TextField("@username")
                    .padding(10)
                    .background(.white)
                    .cornerRadius(6)
            }
        }
        .padding(30)
    }
}
