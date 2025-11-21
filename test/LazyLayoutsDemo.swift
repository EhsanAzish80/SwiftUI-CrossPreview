import SwiftUI

struct LazyLayoutsDemo: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text("Lazy Layouts & Grid")
                    .font(.largeTitle)
                    .bold()
                
                // LazyVStack Example
                VStack(alignment: .leading, spacing: 12) {
                    Text("LazyVStack")
                        .font(.title)
                        .bold()
                    
                    Text("Vertically lazy-loaded stack for efficient rendering of large lists")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    LazyVStack(spacing: 8) {
                        ForEach(1..<11) { i in
                            HStack {
                                Text("Item \(i)")
                                    .font(.headline)
                                Spacer()
                                Text("›")
                                    .foregroundColor(.gray)
                            }
                            .padding()
                            .background(.white)
                            .cornerRadius(8)
                        }
                    }
                    .padding()
                    .background(.ultraThinMaterial)
                    .cornerRadius(12)
                }
                .padding()
                .background(.thinMaterial)
                .cornerRadius(16)
                
                Divider()
                
                // LazyHStack Example
                VStack(alignment: .leading, spacing: 12) {
                    Text("LazyHStack")
                        .font(.title)
                        .bold()
                    
                    Text("Horizontally lazy-loaded stack for scrolling content")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    ScrollView {
                        LazyHStack(spacing: 12) {
                            ForEach(1..<9) { i in
                                VStack {
                                    Circle()
                                        .fill(.blue)
                                        .frame(width: 80, height: 80)
                                    Text("Item \(i)")
                                        .font(.caption)
                                }
                                .padding()
                                .background(.white)
                                .cornerRadius(12)
                            }
                        }
                        .padding()
                    }
                    .background(.ultraThinMaterial)
                    .cornerRadius(12)
                }
                .padding()
                .background(.regularMaterial)
                .cornerRadius(16)
                
                Divider()
                
                // Grid Example
                VStack(alignment: .leading, spacing: 12) {
                    Text("Grid Layout")
                        .font(.title)
                        .bold()
                    
                    Text("SwiftUI 4.0 Grid for precise layout control")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    Grid {
                        GridRow {
                            Text("A1")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.blue)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            
                            Text("B1")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.green)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            
                            Text("C1")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.orange)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                        }
                        
                        GridRow {
                            Text("A2")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.purple)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            
                            Text("B2")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.red)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            
                            Text("C2")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.pink)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                        }
                        
                        GridRow {
                            Text("A3")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.cyan)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            
                            Text("B3")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.indigo)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            
                            Text("C3")
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(.teal)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                }
                .padding()
                .background(.ultraThinMaterial)
                .cornerRadius(16)
                
                // Group Example
                VStack(alignment: .leading, spacing: 12) {
                    Text("Group Container")
                        .font(.title)
                        .bold()
                    
                    Text("Logical grouping without layout effect")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Group {
                            Text("Item 1 in group")
                            Text("Item 2 in group")
                            Text("Item 3 in group")
                        }
                        .padding()
                        .background(.white)
                        .cornerRadius(8)
                        
                        Divider()
                        
                        Group {
                            Text("Another item")
                            Text("And another")
                        }
                        .padding()
                        .background(.white)
                        .cornerRadius(8)
                    }
                    .padding()
                    .background(.regularMaterial)
                    .cornerRadius(12)
                }
                .padding()
                .background(.thinMaterial)
                .cornerRadius(16)
                
                // GeometryReader Example
                VStack(alignment: .leading, spacing: 12) {
                    Text("GeometryReader")
                        .font(.title)
                        .bold()
                    
                    Text("Access to parent size and coordinate space")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    GeometryReader {
                        VStack {
                            Text("This view adapts")
                                .font(.headline)
                            Text("to available space")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                    }
                    .frame(height: 150)
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                }
                .padding()
                .background(.ultraThinMaterial)
                .cornerRadius(16)
                
                // Performance Note
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("💡")
                            .font(.title)
                        Text("Performance Tip")
                            .font(.headline)
                    }
                    
                    Text("Lazy stacks only create views as they become visible, making them ideal for large datasets. Use them for scrollable content with many items.")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                .padding()
                .background(.yellow.opacity(0.1))
                .cornerRadius(12)
            }
            .padding(24)
        }
    }
}
