import SwiftUI

struct VStackListTest: View {
    var body: some View {
        VStack {
            List {
                Text("Hello Ehsan")
                    .font(.title)

            
                ForEach(1..<6) { _ in
                    Text("Styled new text")
                }
            }
        }
        .frame(width: 200, height: 260)
    }
}

struct VStackListTest_Previews: PreviewProvider {
    static var previews: some View {
        VStackListTest()
    }
}
