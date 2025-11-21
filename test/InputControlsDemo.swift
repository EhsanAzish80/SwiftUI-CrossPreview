import SwiftUI

struct InputControlsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Input Controls")
                .font(.largeTitle)
                .bold()
            
            // Slider Examples
            VStack(alignment: .leading, spacing: 12) {
                Text("Slider Controls")
                    .font(.title)
                    .bold()
                
                Text("Basic Slider (0-100)")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                
                Slider(value: 50, in: 0...100)
                    .padding(.horizontal, 8)
                
                Text("Volume Control")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                
                HStack {
                    Text("🔈")
                    Slider(value: 75, in: 0...100)
                    Text("🔊")
                }
                .padding(.horizontal, 8)
            }
            .padding()
            .background(.ultraThinMaterial)
            .cornerRadius(12)
            
            Divider()
            
            // Stepper Examples
            VStack(alignment: .leading, spacing: 12) {
                Text("Stepper Controls")
                    .font(.title)
                    .bold()
                
                Stepper("Count: 5", value: 5)
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
                
                Stepper("Quantity: 10", value: 10)
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
                
                Stepper("Age: 25", value: 25)
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
            }
            .padding()
            .background(.thinMaterial)
            .cornerRadius(12)
            
            Divider()
            
            // DatePicker Examples
            VStack(alignment: .leading, spacing: 12) {
                Text("Date Pickers")
                    .font(.title)
                    .bold()
                
                DatePicker("Birth Date")
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
                
                DatePicker("Appointment")
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
                
                DatePicker("Event Date")
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
            }
            .padding()
            .background(.regularMaterial)
            .cornerRadius(12)
            
            Divider()
            
            // ColorPicker Examples
            VStack(alignment: .leading, spacing: 12) {
                Text("Color Pickers")
                    .font(.title)
                    .bold()
                
                ColorPicker("Background Color")
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
                
                ColorPicker("Text Color")
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
                
                ColorPicker("Accent Color")
                    .padding()
                    .background(.white)
                    .cornerRadius(8)
            }
            .padding()
            .background(.ultraThinMaterial)
            .cornerRadius(12)
            
            // Combined Example
            VStack(alignment: .leading, spacing: 12) {
                Text("Combined Settings")
                    .font(.headline)
                
                Slider(value: 80, in: 0...100)
                    .padding(.horizontal)
                
                HStack {
                    Stepper("Items: 3", value: 3)
                    Spacer()
                }
                .padding(.horizontal)
                
                HStack {
                    DatePicker("Date")
                    Spacer()
                }
                .padding(.horizontal)
                
                HStack {
                    ColorPicker("Theme")
                    Spacer()
                }
                .padding(.horizontal)
            }
            .padding()
            .background(.white)
            .cornerRadius(12)
            .shadow(radius: 5)
        }
        .padding(24)
    }
}
