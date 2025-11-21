import SwiftUI

// Complete app demo combining navigation and tabs
struct CompleteAppDemo: View {
    var body: some View {
        TabView {
            // Home Tab
            NavigationView {
                VStack(spacing: 24) {
                    AsyncImage(url: URL(string: "https://picsum.photos/300/200"))
                        .frame(width: 300, height: 200)
                        .cornerRadius(12)
                    
                    Text("Welcome to the App")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("Explore features using the tabs below")
                        .foregroundColor(.gray)
                    
                    VStack(spacing: 12) {
                        NavigationLink("Getting Started") {
                            Text("Getting Started Guide")
                        }
                        
                        NavigationLink("Features") {
                            Text("App Features")
                        }
                        
                        NavigationLink("Support") {
                            Text("Help & Support")
                        }
                    }
                }
                .navigationTitle("Home")
                .padding()
            }
            .tabItem {
                Label("Home", systemImage: "house.fill")
            }
            
            // Browse Tab
            NavigationView {
                ScrollView {
                    VStack(spacing: 16) {
                        HStack(spacing: 12) {
                            AsyncImage(url: URL(string: "https://picsum.photos/150/150?1"))
                                .frame(width: 150, height: 150)
                                .cornerRadius(8)
                            
                            AsyncImage(url: URL(string: "https://picsum.photos/150/150?2"))
                                .frame(width: 150, height: 150)
                                .cornerRadius(8)
                        }
                        
                        HStack(spacing: 12) {
                            AsyncImage(url: URL(string: "https://picsum.photos/150/150?3"))
                                .frame(width: 150, height: 150)
                                .cornerRadius(8)
                            
                            AsyncImage(url: URL(string: "https://picsum.photos/150/150?4"))
                                .frame(width: 150, height: 150)
                                .cornerRadius(8)
                        }
                        
                        NavigationLink("View All") {
                            Text("All Items")
                        }
                        .padding()
                    }
                    .padding()
                }
                .navigationTitle("Browse")
                .searchable()
            }
            .tabItem {
                Label("Browse", systemImage: "square.grid.2x2.fill")
            }
            
            // Messages Tab
            NavigationView {
                VStack(spacing: 16) {
                    DisclosureGroup("Today") {
                        VStack(alignment: .leading, spacing: 12) {
                            NavigationLink("John Doe") {
                                Text("Message from John")
                            }
                            NavigationLink("Jane Smith") {
                                Text("Message from Jane")
                            }
                        }
                    }
                    
                    DisclosureGroup("Yesterday") {
                        VStack(alignment: .leading, spacing: 12) {
                            NavigationLink("Bob Johnson") {
                                Text("Message from Bob")
                            }
                            NavigationLink("Alice Brown") {
                                Text("Message from Alice")
                            }
                        }
                    }
                    
                    DisclosureGroup("Older") {
                        VStack(alignment: .leading, spacing: 12) {
                            NavigationLink("Charlie Wilson") {
                                Text("Message from Charlie")
                            }
                        }
                    }
                }
                .navigationTitle("Messages")
                .toolbar()
                .padding()
            }
            .tabItem {
                Label("Messages", systemImage: "message.fill")
            }
            .badge(5)
            
            // Profile Tab
            NavigationView {
                ScrollView {
                    VStack(spacing: 24) {
                        AsyncImage(url: URL(string: "https://picsum.photos/120/120"))
                            .frame(width: 120, height: 120)
                            .clipShape(Circle())
                            .overlay(
                                Circle()
                                    .stroke(Color.blue, lineWidth: 3)
                            )
                        
                        Text("John Doe")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("Premium Member")
                            .font(.subheadline)
                            .foregroundColor(.orange)
                        
                        DisclosureGroup("Account Settings") {
                            VStack(alignment: .leading, spacing: 12) {
                                NavigationLink("Edit Profile") {
                                    ProfileEditView()
                                }
                                NavigationLink("Privacy Settings") {
                                    Text("Privacy Settings")
                                }
                                NavigationLink("Security") {
                                    Text("Security Settings")
                                }
                            }
                        }
                        
                        DisclosureGroup("Preferences") {
                            VStack(alignment: .leading, spacing: 12) {
                                Toggle("Notifications", isOn: true)
                                Toggle("Dark Mode", isOn: false)
                                Toggle("Auto-play Videos", isOn: true)
                            }
                        }
                        
                        DisclosureGroup("About") {
                            VStack(alignment: .leading, spacing: 12) {
                                NavigationLink("Terms of Service") {
                                    Text("Terms of Service")
                                }
                                NavigationLink("Privacy Policy") {
                                    Text("Privacy Policy")
                                }
                                NavigationLink("Help Center") {
                                    Text("Help Center")
                                }
                            }
                        }
                    }
                    .padding()
                }
                .navigationTitle("Profile")
            }
            .tabItem {
                Label("Profile", systemImage: "person.fill")
            }
        }
    }
}

struct ProfileEditView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Edit Profile")
                .font(.title2)
                .fontWeight(.bold)
            
            TextField("Full Name", text: "John Doe")
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            TextField("Email", text: "john@example.com")
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            Text("Bio")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            TextEditor(text: "Tell us about yourself...")
                .frame(height: 120)
                .border(Color.gray.opacity(0.3), width: 1)
            
            HStack {
                Spacer()
                Button("Cancel") {
                    // Cancel
                }
                .foregroundColor(.red)
                
                Button("Save") {
                    // Save
                }
                .foregroundColor(.blue)
                .fontWeight(.semibold)
            }
            
            Spacer()
        }
        .padding()
        .navigationTitle("Edit Profile")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// E-commerce app demo
struct ShoppingAppDemo: View {
    var body: some View {
        TabView {
            NavigationStack {
                ScrollView {
                    VStack(spacing: 20) {
                        Text("Featured Products")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        LazyVStack(spacing: 16) {
                            ForEach(0..<5) { index in
                                HStack(spacing: 16) {
                                    AsyncImage(url: URL(string: "https://picsum.photos/80/80?\\(index)"))
                                        .frame(width: 80, height: 80)
                                        .cornerRadius(8)
                                    
                                    VStack(alignment: .leading, spacing: 8) {
                                        Text("Product \\(index + 1)")
                                            .fontWeight(.semibold)
                                        Text("$29.99")
                                            .foregroundColor(.green)
                                        Text("In stock")
                                            .font(.caption)
                                            .foregroundColor(.gray)
                                    }
                                    
                                    Spacer()
                                    
                                    NavigationLink("View") {
                                        ProductDetailView(productId: index)
                                    }
                                }
                                .padding()
                                .background(Color.white)
                                .cornerRadius(12)
                                .shadow(radius: 2)
                            }
                        }
                    }
                    .padding()
                }
                .navigationTitle("Shop")
                .searchable()
            }
            .tabItem {
                Label("Shop", systemImage: "bag.fill")
            }
            
            NavigationView {
                Text("Cart is empty")
                    .foregroundColor(.gray)
                    .navigationTitle("Cart")
            }
            .tabItem {
                Label("Cart", systemImage: "cart.fill")
            }
            .badge(3)
            
            NavigationView {
                Text("No orders yet")
                    .foregroundColor(.gray)
                    .navigationTitle("Orders")
            }
            .tabItem {
                Label("Orders", systemImage: "archivebox.fill")
            }
        }
    }
}

struct ProductDetailView: View {
    let productId: Int
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                AsyncImage(url: URL(string: "https://picsum.photos/350/300?\\(productId)"))
                    .frame(width: 350, height: 300)
                    .cornerRadius(12)
                
                Text("Product \\(productId + 1)")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("$29.99")
                    .font(.title2)
                    .foregroundColor(.green)
                
                Text("Description")
                    .font(.headline)
                    .padding(.top, 8)
                
                Text("This is a high-quality product with excellent features. Perfect for everyday use.")
                    .foregroundColor(.gray)
                
                DisclosureGroup("Specifications") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("• Dimension: 10x5x2 inches")
                        Text("• Weight: 1.5 lbs")
                        Text("• Material: Premium")
                        Text("• Color: Available in 5 colors")
                    }
                }
                
                DisclosureGroup("Shipping & Returns") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("• Free shipping on orders over $50")
                        Text("• 30-day return policy")
                        Text("• Ships within 2-3 business days")
                    }
                }
                
                Button("Add to Cart") {
                    // Add to cart
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
            .padding()
        }
        .navigationTitle("Product Details")
        .navigationBarTitleDisplayMode(.inline)
    }
}
