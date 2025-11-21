import SwiftUI

struct TestView: View {
    var body: some View {
        VStack {
            Text("Hello Ehsan")
                .font(.largeTitle)
                .padding()
            
            List {
                ForEach(1..<4) { index in
                    Text("Styled new text")
                        .padding(10)
                }
            }
        }
    }
}

struct TestView_Previews: PreviewProvider {
    static var previews: some View {
        TestView()
    }
}
