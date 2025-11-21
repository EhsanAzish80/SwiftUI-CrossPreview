import SwiftUI

struct ProgressMenuDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Text("Progress & Menu Components")
                .font(.largeTitle)
                .bold()
            
            // ProgressView Examples
            VStack(alignment: .leading, spacing: 16) {
                Text("Progress Indicators")
                    .font(.title)
                    .bold()
                
                // Indeterminate progress (loading spinner)
                VStack(alignment: .leading, spacing: 8) {
                    Text("Loading Spinner (Indeterminate)")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    HStack {
                        ProgressView()
                        Text("Loading...")
                            .foregroundColor(.gray)
                    }
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(.white)
                    .cornerRadius(8)
                }
                
                // Determinate progress bars
                VStack(alignment: .leading, spacing: 12) {
                    Text("Progress Bars (Determinate)")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    VStack(spacing: 12) {
                        HStack {
                            Text("25%")
                                .font(.caption)
                                .foregroundColor(.gray)
                            ProgressView(value: 0.25)
                        }
                        
                        HStack {
                            Text("50%")
                                .font(.caption)
                                .foregroundColor(.gray)
                            ProgressView(value: 0.5)
                        }
                        
                        HStack {
                            Text("75%")
                                .font(.caption)
                                .foregroundColor(.gray)
                            ProgressView(value: 0.75)
                        }
                        
                        HStack {
                            Text("100%")
                                .font(.caption)
                                .foregroundColor(.gray)
                            ProgressView(value: 1.0)
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
                }
                
                // Real-world examples
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Download Progress")
                            .font(.subheadline)
                        Spacer()
                        Text("45%")
                            .font(.caption)
                            .foregroundColor(.blue)
                    }
                    ProgressView(value: 0.45)
                    
                    HStack {
                        Text("Upload Progress")
                            .font(.subheadline)
                        Spacer()
                        Text("82%")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                    ProgressView(value: 0.82)
                }
                .padding()
                .background(.ultraThinMaterial)
                .cornerRadius(12)
            }
            .padding()
            .background(.thinMaterial)
            .cornerRadius(16)
            
            Divider()
            
            // Menu Examples
            VStack(alignment: .leading, spacing: 16) {
                Text("Menu Components")
                    .font(.title)
                    .bold()
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Simple Menus")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 12) {
                        Menu("File") {
                            Button("New")
                            Button("Open")
                            Button("Save")
                        }
                        
                        Menu("Edit") {
                            Button("Cut")
                            Button("Copy")
                            Button("Paste")
                        }
                        
                        Menu("View") {
                            Button("Zoom In")
                            Button("Zoom Out")
                            Button("Actual Size")
                        }
                    }
                }
                .padding()
                .background(.white)
                .cornerRadius(8)
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Action Menus")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 12) {
                        Menu("Options") {
                            Button("Settings")
                            Button("Preferences")
                            Button("About")
                        }
                        
                        Menu("Export") {
                            Button("PDF")
                            Button("PNG")
                            Button("SVG")
                        }
                    }
                }
                .padding()
                .background(.white)
                .cornerRadius(8)
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Styled Menu")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    Menu("Actions") {
                        Button("Share")
                        Button("Delete")
                        Button("Archive")
                    }
                    .padding()
                    .background(.blue)
                    .cornerRadius(8)
                }
                .padding()
                .background(.white)
                .cornerRadius(8)
            }
            .padding()
            .background(.regularMaterial)
            .cornerRadius(16)
            
            // Combined Example
            VStack(alignment: .leading, spacing: 12) {
                Text("Document Processing")
                    .font(.headline)
                
                HStack {
                    ProgressView()
                    Text("Processing document...")
                }
                .padding()
                .background(.white)
                .cornerRadius(8)
                
                HStack {
                    Text("Status: In Progress")
                        .font(.subheadline)
                    Spacer()
                    Menu("More") {
                        Button("Pause")
                        Button("Cancel")
                        Button("Details")
                    }
                }
                .padding()
                .background(.white)
                .cornerRadius(8)
            }
            .padding()
            .background(.ultraThinMaterial)
            .cornerRadius(12)
            .shadow(radius: 5)
        }
        .padding(24)
    }
}
