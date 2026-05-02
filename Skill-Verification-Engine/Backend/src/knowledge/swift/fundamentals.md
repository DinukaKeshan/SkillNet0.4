Swift is a compiled, type-safe programming language developed by Apple for iOS, macOS, and more.

Swift uses type inference: let name = "Alice" infers String type.

Constants use let; variables use var: let pi = 3.14; var count = 0;

Optionals represent values that may be absent: var name: String? = nil.

Optional unwrapping: if let name = optionalName { print(name) } or guard let.

Force unwrapping with ! crashes if the value is nil: let name = optionalName!

The nil-coalescing operator: let name = optionalName ?? "Unknown".

Closures are self-contained blocks of functionality: { (a: Int, b: Int) -> Int in return a + b }.

Trailing closure syntax: numbers.sorted { $0 < $1 }.

Protocols define a blueprint of methods and properties: protocol Drawable { func draw() }.

Protocol extensions provide default implementations.

Extensions add functionality to existing types: extension Int { var isEven: Bool { self % 2 == 0 } }.

Structs are value types; classes are reference types. Prefer structs in Swift.

Enums can have associated values: enum Barcode { case upc(Int, Int, Int, Int) case qr(String) }.

ARC (Automatic Reference Counting) manages memory for class instances.

Strong references create retain cycles; use weak or unowned to break cycles.

SwiftUI is a declarative UI framework: struct ContentView: View { var body: some View { Text("Hello") } }.

SwiftUI uses @State, @Binding, @ObservedObject, @EnvironmentObject for state management.

Xcode is Apple's IDE for Swift development, providing Interface Builder, simulators, and debugging tools.

Error handling: do { try riskyFunction() } catch { print(error) }. Functions marked with throws.

guard statements exit early: guard condition else { return }.
