import SwiftUI

struct VStackTest1: View {
    var body: some View {
        VStack {
            Text("Hello Ehsan (Outside List)")
                .font(.title)
                .padding()
            
            List {
                ForEach(1..<6) { _ in
                    Text("Styled new text")
                }
            }
        }
        .frame(width: 300, height: 400)
    }
}

struct VStackTest2: View {
    var body: some View {
        VStack {
            List {
                Text("Hello Ehsan (Inside List)")
                    .font(.title)
                
                ForEach(1..<6) { _ in
                    Text("Styled new text")
                }
            }
        }
        .frame(width: 300, height: 400)
    }
}

struct VStackTest1_Previews: PreviewProvider {
    static var previews: some View {
        VStackTest1()
    }
}
