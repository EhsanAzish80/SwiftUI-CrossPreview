import SwiftUI

struct TogglePickerDemo: View {
    @State private var isEnabled = false
    @State private var selectedColor = "Red"
    
    var body: some View {
        Form {
            Section(header: Text("Settings")) {
                Toggle("Enable Notifications", isOn: $isEnabled)
                
                Toggle("Dark Mode", isOn: $isEnabled)
                
                Picker("Favorite Color", selection: $selectedColor) {
                    Text("Red")
                    Text("Blue")
                    Text("Green")
                    Text("Yellow")
                }
            }
            
            Section(header: Text("Preferences")) {
                Toggle("Auto-save", isOn: $isEnabled)
                
                Picker("Theme", selection: $selectedColor) {
                    Text("Light")
                    Text("Dark")
                    Text("Auto")
                }
            }
        }
    }
}

struct TogglePickerDemo_Previews: PreviewProvider {
    static var previews: some View {
        TogglePickerDemo()
    }
}
