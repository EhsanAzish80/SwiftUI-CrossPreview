import SwiftUI

struct FrameTest: View {
    var body: some View {
        VStack {
            Text("This should be 200 wide")
                .padding()
                .background(Color.blue)
                .cornerRadius(8)
        }
        .frame(width: 200, height: 260)
        .background(Color.gray.opacity(0.2))
        .cornerRadius(12)
    }
}

struct FrameTest_Previews: PreviewProvider {
    static var previews: some View {
        FrameTest()
    }
}
