import SwiftUI

struct DisclosureGroupDemo: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("Disclosure Group Examples")
                .font(.title)
                .fontWeight(.bold)
                .padding(.bottom, 8)
            
            // Basic disclosure group
            DisclosureGroup("Show Details") {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Detail 1")
                    Text("Detail 2")
                    Text("Detail 3")
                }
                .padding(.leading)
            }
            
            // Multiple disclosure groups
            DisclosureGroup("Personal Information") {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Name: John Doe")
                    Text("Email: john@example.com")
                    Text("Phone: (555) 123-4567")
                }
                .padding(.leading)
            }
            
            DisclosureGroup("Address") {
                VStack(alignment: .leading, spacing: 8) {
                    Text("123 Main Street")
                    Text("Apartment 4B")
                    Text("New York, NY 10001")
                }
                .padding(.leading)
            }
            
            DisclosureGroup("Preferences") {
                VStack(alignment: .leading, spacing: 12) {
                    Toggle("Notifications", isOn: true)
                    Toggle("Dark Mode", isOn: false)
                    Toggle("Auto-save", isOn: true)
                }
                .padding(.leading)
            }
        }
        .padding()
    }
}

struct NestedDisclosureDemo: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("Nested Disclosure Groups")
                .font(.title2)
                .fontWeight(.bold)
            
            DisclosureGroup("Category 1") {
                VStack(alignment: .leading, spacing: 8) {
                    DisclosureGroup("Subcategory 1.1") {
                        Text("Item 1")
                        Text("Item 2")
                        Text("Item 3")
                    }
                    
                    DisclosureGroup("Subcategory 1.2") {
                        Text("Item A")
                        Text("Item B")
                        Text("Item C")
                    }
                }
            }
            
            DisclosureGroup("Category 2") {
                VStack(alignment: .leading, spacing: 8) {
                    DisclosureGroup("Subcategory 2.1") {
                        Text("Option 1")
                        Text("Option 2")
                    }
                    
                    DisclosureGroup("Subcategory 2.2") {
                        Text("Setting A")
                        Text("Setting B")
                        Text("Setting C")
                    }
                }
            }
        }
        .padding()
    }
}

struct FAQView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Text("Frequently Asked Questions")
                    .font(.title)
                    .fontWeight(.bold)
                    .padding(.bottom, 8)
                
                DisclosureGroup("What is SwiftUI?") {
                    Text("SwiftUI is a modern framework for building user interfaces across all Apple platforms using Swift.")
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                }
                
                DisclosureGroup("How do I get started?") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("1. Install Xcode")
                        Text("2. Create a new SwiftUI project")
                        Text("3. Start building your views")
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
                }
                
                DisclosureGroup("What are the benefits?") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("• Declarative syntax")
                        Text("• Live preview")
                        Text("• Cross-platform")
                        Text("• Less code")
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
                }
                
                DisclosureGroup("Is it production ready?") {
                    Text("Yes! SwiftUI has been production-ready since iOS 13 and continues to improve with each release.")
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                }
                
                DisclosureGroup("Where can I learn more?") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("• Apple Developer Documentation")
                        Text("• SwiftUI Tutorials")
                        Text("• WWDC Videos")
                        Text("• Community Forums")
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
                }
            }
            .padding()
        }
    }
}

struct SettingsWithDisclosure: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("Settings")
                .font(.title)
                .fontWeight(.bold)
            
            DisclosureGroup("Account") {
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Username")
                        Spacer()
                        Text("john_doe")
                            .foregroundColor(.gray)
                    }
                    
                    HStack {
                        Text("Email")
                        Spacer()
                        Text("john@example.com")
                            .foregroundColor(.gray)
                    }
                    
                    Button("Change Password") {
                        // Action
                    }
                    .foregroundColor(.blue)
                }
                .padding()
            }
            
            DisclosureGroup("Privacy") {
                VStack(alignment: .leading, spacing: 12) {
                    Toggle("Share Analytics", isOn: false)
                    Toggle("Personalized Ads", isOn: false)
                    Toggle("Location Services", isOn: true)
                }
                .padding()
            }
            
            DisclosureGroup("Notifications") {
                VStack(alignment: .leading, spacing: 12) {
                    Toggle("Push Notifications", isOn: true)
                    Toggle("Email Notifications", isOn: true)
                    Toggle("SMS Notifications", isOn: false)
                }
                .padding()
            }
        }
        .padding()
    }
}
