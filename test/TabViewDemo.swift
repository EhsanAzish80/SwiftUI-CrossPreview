import SwiftUI

struct TabViewDemo: View {
    var body: some View {
        TabView {
            VStack {
                Text("Home View")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Welcome to the app!")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .tabItem {
                Label("Home", systemImage: "house.fill")
            }
            
            VStack {
                Text("Search View")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Search for items")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .tabItem {
                Label("Search", systemImage: "magnifyingglass")
            }
            
            VStack {
                Text("Favorites")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Your favorite items")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .tabItem {
                Label("Favorites", systemImage: "heart.fill")
            }
            .badge(3)
            
            VStack {
                Text("Profile")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Your account settings")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .tabItem {
                Label("Profile", systemImage: "person.fill")
            }
        }
    }
}

struct TabViewWithBadges: View {
    var body: some View {
        TabView {
            Text("Messages")
                .font(.title)
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }
                .badge(12)
            
            Text("Notifications")
                .font(.title)
                .tabItem {
                    Label("Notifications", systemImage: "bell.fill")
                }
                .badge(5)
            
            Text("Settings")
                .font(.title)
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
    }
}

struct TabViewWithNavigationDemo: View {
    var body: some View {
        TabView {
            NavigationView {
                List {
                    NavigationLink("Article 1") {
                        Text("Article 1 Content")
                    }
                    NavigationLink("Article 2") {
                        Text("Article 2 Content")
                    }
                    NavigationLink("Article 3") {
                        Text("Article 3 Content")
                    }
                }
                .navigationTitle("News")
            }
            .tabItem {
                Label("News", systemImage: "newspaper.fill")
            }
            
            NavigationView {
                VStack {
                    Text("Bookmarks")
                        .font(.largeTitle)
                    Text("No bookmarks yet")
                        .foregroundColor(.gray)
                }
                .navigationTitle("Bookmarks")
            }
            .tabItem {
                Label("Bookmarks", systemImage: "bookmark.fill")
            }
            .badge("New")
            
            NavigationView {
                VStack {
                    Text("Settings")
                        .font(.largeTitle)
                    List {
                        Text("Account")
                        Text("Privacy")
                        Text("Notifications")
                    }
                }
                .navigationTitle("Settings")
            }
            .tabItem {
                Label("Settings", systemImage: "gearshape.fill")
            }
        }
    }
}

struct CustomTabView: View {
    var body: some View {
        TabView {
            Text("Tab 1")
                .font(.largeTitle)
                .tabItem {
                    Text("First")
                }
            
            Text("Tab 2")
                .font(.largeTitle)
                .tabItem {
                    Text("Second")
                }
                .badge(99)
            
            Text("Tab 3")
                .font(.largeTitle)
                .tabItem {
                    Text("Third")
                }
        }
    }
}
