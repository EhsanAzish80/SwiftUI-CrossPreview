import SwiftUI

struct ScrollTest: View {
    var body: some View {
        VStack {
            Text("Hello Ehsan")
                .font(.title)
                .padding()
            
            List {
                ForEach(1..<15) { index in
                    Text("List Item \(index)")
                        .padding(8)
                }
            }
        }
        .frame(width: 300, height: 400)
    }
}

struct ScrollTest_Previews: PreviewProvider {
    static var previews: some View {
        ScrollTest()
    }
}
