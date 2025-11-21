import SwiftUI

struct NavigationViewSimple: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("Home Screen")
                    .font(.largeTitle)
                
                NavigationLink("Go to Settings") {
                    Text("Settings")
                }
                
                NavigationLink("Go to Profile") {
                    Text("Profile")
                }
            }
            .navigationTitle("Home")
        }
    }
}
