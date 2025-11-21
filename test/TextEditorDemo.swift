import SwiftUI

struct TextEditorDemo: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Text Editor Examples")
                .font(.title)
                .fontWeight(.bold)
            
            // Basic text editor
            TextEditor(text: "Enter your notes here...")
                .frame(height: 150)
                .border(Color.gray, width: 1)
            
            // Styled text editor
            TextEditor(text: "Write your thoughts...")
                .frame(height: 120)
                .padding(8)
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
            
            // Multiple text editors
            HStack(spacing: 16) {
                VStack {
                    Text("Left Editor")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextEditor(text: "Left content")
                        .frame(height: 100)
                        .border(Color.blue, width: 1)
                }
                
                VStack {
                    Text("Right Editor")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextEditor(text: "Right content")
                        .frame(height: 100)
                        .border(Color.green, width: 1)
                }
            }
        }
        .padding()
    }
}

struct NoteEditorView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Create Note")
                .font(.title2)
                .fontWeight(.bold)
            
            TextField("Title", text: "Note Title")
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            Text("Content")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            TextEditor(text: "Write your note content here...")
                .frame(height: 200)
                .padding(8)
                .background(Color.gray.opacity(0.05))
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            
            HStack {
                Spacer()
                Button("Cancel") {
                    // Cancel action
                }
                .foregroundColor(.red)
                
                Button("Save") {
                    // Save action
                }
                .foregroundColor(.blue)
                .fontWeight(.semibold)
            }
        }
        .padding()
    }
}

struct CommentEditorView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text("JD")
                            .foregroundColor(.white)
                            .fontWeight(.bold)
                    )
                
                VStack(alignment: .leading) {
                    Text("John Doe")
                        .fontWeight(.semibold)
                    Text("2 hours ago")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Spacer()
            }
            
            TextEditor(text: "Add a comment...")
                .frame(height: 100)
                .padding(8)
                .background(Color.gray.opacity(0.08))
                .cornerRadius(8)
            
            HStack {
                Spacer()
                Text("0/500")
                    .font(.caption)
                    .foregroundColor(.gray)
                
                Button("Post") {
                    // Post comment
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(radius: 4)
    }
}

struct MultiTextEditorsDemo: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Form with Text Editors")
                    .font(.title)
                    .fontWeight(.bold)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Description")
                        .fontWeight(.semibold)
                    TextEditor(text: "Brief description...")
                        .frame(height: 80)
                        .border(Color.gray.opacity(0.5), width: 1)
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Additional Notes")
                        .fontWeight(.semibold)
                    TextEditor(text: "Any additional information...")
                        .frame(height: 120)
                        .border(Color.gray.opacity(0.5), width: 1)
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Comments")
                        .fontWeight(.semibold)
                    TextEditor(text: "Your comments...")
                        .frame(height: 100)
                        .border(Color.gray.opacity(0.5), width: 1)
                }
            }
            .padding()
        }
    }
}
