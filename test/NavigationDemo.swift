import SwiftUI

struct NavigationDemo: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 16) {
                Text("Navigation Demo")
                    .font(.title)
                    .fontWeight(.bold)
                
                NavigationLink("View Details") {
                    Text("Details View")
                }
                
                NavigationLink("Settings") {
                    Text("Settings View")
                }
                
                NavigationLink("Profile") {
                    Text("Profile View")
                }
                
                NavigationLink("About") {
                    Text("About View")
                }
            }
            .navigationTitle("Home")
            .padding()
        }
    }
}

struct NavigationStackDemo: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationLink("Item 1") {
                    Text("Item 1 Details")
                }
                
                NavigationLink("Item 2") {
                    Text("Item 2 Details")
                }
                
                NavigationLink("Item 3") {
                    Text("Item 3 Details")
                }
            }
            .navigationTitle("Items")
            .navigationBarTitleDisplayMode(.large)
            .toolbar()
        }
    }
}

struct NavigationSplitViewDemo: View {
    var body: some View {
        NavigationSplitView {
            List {
                Text("Sidebar Item 1")
                Text("Sidebar Item 2")
                Text("Sidebar Item 3")
                Text("Sidebar Item 4")
            }
        } detail: {
            VStack {
                Text("Detail View")
                    .font(.largeTitle)
                Text("Select an item from the sidebar")
                    .foregroundColor(.gray)
            }
        }
    }
}

struct NestedNavigationDemo: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Main Menu")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                NavigationLink("Categories") {
                    VStack {
                        NavigationLink("Electronics") {
                            Text("Electronics Products")
                        }
                        NavigationLink("Clothing") {
                            Text("Clothing Products")
                        }
                        NavigationLink("Books") {
                            Text("Books Products")
                        }
                    }
                    .navigationTitle("Categories")
                }
                
                NavigationLink("Search") {
                    Text("Search View")
                        .navigationTitle("Search")
                        .searchable()
                }
            }
            .navigationTitle("Store")
            .navigationBarTitleDisplayMode(.inline)
            .padding()
        }
    }
}
