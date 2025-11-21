import SwiftUI

struct FormsExample: View {
    var body: some View {
        Form {
            Section(header: Text("Personal Info")) {
                Text("Name")
                Text("Email")
            }
            
            Section(header: Text("Settings")) {
                Text("Notifications")
                Text("Privacy")
            }
        }
    }
}

struct ScrollViewExample: View {
    var body: some View {
        ScrollView {
            VStack {
                ForEach(["Red", "Blue", "Green"]) { color in
                    Text(color)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(8)
                }
            }
        }
    }
}

struct FormsExample_Previews: PreviewProvider {
    static var previews: some View {
        FormsExample()
    }
}
