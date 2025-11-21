import SwiftUI

struct StateVisualizationDemo: View {
    @State private var isOn: Bool = false
    @State private var count: Int = 0
    @State private var name: String = "John"
    @State private var sliderValue: Double = 0.5
    
    var body: some View {
        VStack(spacing: 20) {
            Text("State Visualization Demo")
                .font(.title)
                .fontWeight(.bold)
            
            Text("State properties are shown with badges")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            VStack(spacing: 16) {
                Toggle("Toggle State", isOn: isOn)
                
                HStack {
                    Text("Count: \(count)")
                    Spacer()
                    Stepper("", value: count)
                }
                
                TextField("Name", text: name)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                VStack(alignment: .leading) {
                    Text("Slider: \(sliderValue, specifier: "%.2f")")
                    Slider(value: sliderValue)
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
        }
        .padding()
    }
}

struct BindingDemo: View {
    @State private var username: String = ""
    @State private var isAgreed: Bool = false
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Binding Example")
                .font(.title2)
                .fontWeight(.semibold)
            
            UsernameField(username: $username)
            
            AgreementToggle(isAgreed: $isAgreed)
            
            Button("Submit") {
                // Submit action
            }
            .disabled(!isAgreed || username.isEmpty)
        }
        .padding()
    }
}

struct UsernameField: View {
    @Binding var username: String
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("Username")
                .font(.headline)
            TextField("Enter username", text: $username)
                .textFieldStyle(RoundedBorderTextFieldStyle())
        }
    }
}

struct AgreementToggle: View {
    @Binding var isAgreed: Bool
    
    var body: some View {
        Toggle("I agree to the terms", isOn: $isAgreed)
    }
}

struct StateObjectDemo: View {
    @StateObject private var viewModel = ViewModel()
    @State private var searchText: String = ""
    
    var body: some View {
        VStack(spacing: 16) {
            Text("StateObject Demo")
                .font(.title2)
                .fontWeight(.semibold)
            
            TextField("Search", text: $searchText)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            Text("Results: \(viewModel.itemCount)")
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding()
    }
}

struct CounterView: View {
    @State private var count: Int = 0
    @State private var stepSize: Int = 1
    @State private var isAnimated: Bool = true
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Counter: \(count)")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.blue)
            
            HStack(spacing: 16) {
                Button("-") {
                    count -= stepSize
                }
                .padding()
                .background(Color.red)
                .foregroundColor(.white)
                .cornerRadius(8)
                
                Button("+") {
                    count += stepSize
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
            
            VStack(alignment: .leading, spacing: 8) {
                Text("Settings")
                    .font(.headline)
                
                Stepper("Step Size: \(stepSize)", value: $stepSize, in: 1...10)
                
                Toggle("Animated", isOn: $isAnimated)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
        }
        .padding()
    }
}

struct FormWithState: View {
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var email: String = ""
    @State private var age: Int = 18
    @State private var receiveNotifications: Bool = true
    @State private var selectedColor: Color = .blue
    
    var body: some View {
        Form {
            Section("Personal Information") {
                TextField("First Name", text: $firstName)
                TextField("Last Name", text: $lastName)
                TextField("Email", text: $email)
                Stepper("Age: \(age)", value: $age, in: 0...120)
            }
            
            Section("Preferences") {
                Toggle("Receive Notifications", isOn: $receiveNotifications)
                ColorPicker("Favorite Color", selection: $selectedColor)
            }
        }
    }
}

struct MultiStateDemo: View {
    @State private var temperature: Double = 20.0
    @State private var humidity: Double = 50.0
    @State private var isHeating: Bool = false
    @State private var isCooling: Bool = false
    @State private var fanSpeed: Int = 2
    @State private var mode: String = "auto"
    
    var body: some View {
        VStack(spacing: 24) {
            Text("Climate Control")
                .font(.title)
                .fontWeight(.bold)
            
            VStack(spacing: 16) {
                VStack(alignment: .leading) {
                    Text("Temperature: \(temperature, specifier: "%.1f")°C")
                        .font(.headline)
                    Slider(value: $temperature, in: 10...30)
                }
                
                VStack(alignment: .leading) {
                    Text("Humidity: \(humidity, specifier: "%.0f")%")
                        .font(.headline)
                    Slider(value: $humidity, in: 0...100)
                }
            }
            .padding()
            .background(Color.blue.opacity(0.1))
            .cornerRadius(12)
            
            VStack(spacing: 12) {
                Toggle("Heating", isOn: $isHeating)
                Toggle("Cooling", isOn: $isCooling)
                
                Stepper("Fan Speed: \(fanSpeed)", value: $fanSpeed, in: 0...5)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
        }
        .padding()
    }
}
