import SwiftUI

struct CommentTest: View {
    var body: some View {
        VStack {
            Text("This will show")
                .padding()
            
            // Text("This is commented out")
            //     .foregroundColor(.red)
            
            Text("This will also show")
                .font(.headline)
            
            // HStack {
            //     Text("Hidden")
            //     Text("Also hidden")
            // }
            
            Text("Final text") // This comment is after code
        }
    }
}

struct CommentTest_Previews: PreviewProvider {
    static var previews: some View {
        CommentTest()
    }
}
