import SwiftUI

struct AsyncImageDemo: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Async Image Examples")
                .font(.title)
                .fontWeight(.bold)
            
            // Basic async image
            AsyncImage(url: URL(string: "https://picsum.photos/200/200"))
                .frame(width: 200, height: 200)
                .cornerRadius(10)
            
            // Multiple images
            HStack(spacing: 16) {
                AsyncImage(url: URL(string: "https://picsum.photos/150/150?1"))
                    .frame(width: 150, height: 150)
                    .cornerRadius(8)
                
                AsyncImage(url: URL(string: "https://picsum.photos/150/150?2"))
                    .frame(width: 150, height: 150)
                    .cornerRadius(8)
            }
            
            // Grid of images
            VStack(spacing: 12) {
                HStack(spacing: 12) {
                    AsyncImage(url: URL(string: "https://picsum.photos/100/100?3"))
                        .frame(width: 100, height: 100)
                    AsyncImage(url: URL(string: "https://picsum.photos/100/100?4"))
                        .frame(width: 100, height: 100)
                    AsyncImage(url: URL(string: "https://picsum.photos/100/100?5"))
                        .frame(width: 100, height: 100)
                }
                HStack(spacing: 12) {
                    AsyncImage(url: URL(string: "https://picsum.photos/100/100?6"))
                        .frame(width: 100, height: 100)
                    AsyncImage(url: URL(string: "https://picsum.photos/100/100?7"))
                        .frame(width: 100, height: 100)
                    AsyncImage(url: URL(string: "https://picsum.photos/100/100?8"))
                        .frame(width: 100, height: 100)
                }
            }
        }
        .padding()
    }
}

struct AsyncImageWithModifiers: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Styled Async Images")
                .font(.title2)
                .fontWeight(.semibold)
            
            // Circular image
            AsyncImage(url: URL(string: "https://picsum.photos/180/180"))
                .frame(width: 180, height: 180)
                .clipShape(Circle())
                .overlay(
                    Circle()
                        .stroke(Color.blue, lineWidth: 4)
                )
            
            // Rounded rectangle with shadow
            AsyncImage(url: URL(string: "https://picsum.photos/250/150"))
                .frame(width: 250, height: 150)
                .cornerRadius(12)
                .shadow(radius: 8)
            
            // With border
            AsyncImage(url: URL(string: "https://picsum.photos/200/120"))
                .frame(width: 200, height: 120)
                .border(Color.purple, width: 3)
        }
        .padding()
    }
}

struct ProfileWithAsyncImage: View {
    var body: some View {
        VStack(spacing: 16) {
            AsyncImage(url: URL(string: "https://picsum.photos/120/120"))
                .frame(width: 120, height: 120)
                .clipShape(Circle())
                .overlay(
                    Circle()
                        .stroke(
                            LinearGradient(
                                gradient: Gradient(colors: [.blue, .purple]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 4
                        )
                )
            
            Text("John Doe")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("iOS Developer")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            HStack(spacing: 20) {
                VStack {
                    Text("124")
                        .font(.headline)
                        .fontWeight(.bold)
                    Text("Posts")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                VStack {
                    Text("2.5K")
                        .font(.headline)
                        .fontWeight(.bold)
                    Text("Followers")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                VStack {
                    Text("384")
                        .font(.headline)
                        .fontWeight(.bold)
                    Text("Following")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .padding(.top, 8)
        }
        .padding()
    }
}
