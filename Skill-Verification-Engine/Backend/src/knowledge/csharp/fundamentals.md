C# is a modern, object-oriented language developed by Microsoft, running on the .NET platform.

C# is statically typed and supports garbage collection for automatic memory management.

The Main method is the entry point: static void Main(string[] args) { }.

Value types (int, float, bool, struct) are stored on the stack; reference types (class, string, array) on the heap.

Nullable types allow value types to be null: int? x = null;

The null-coalescing operator: int y = x ?? 0; provides a default if null.

LINQ (Language Integrated Query) queries collections: var result = list.Where(x => x > 5).Select(x => x * 2);

LINQ methods: Where, Select, OrderBy, GroupBy, First, Any, All, Count, Sum, Average.

async/await enables asynchronous programming: async Task<string> FetchData() { return await httpClient.GetStringAsync(url); }

Task and Task<T> represent asynchronous operations.

Delegates are type-safe function pointers: delegate int MathOp(int a, int b);

Events are built on delegates: public event EventHandler OnClick;

Generics: class Stack<T> { } and methods: T Max<T>(T a, T b) where T : IComparable<T>.

Interfaces define contracts: interface IShape { double Area(); } implemented with class Circle : IShape.

Properties use get/set accessors: public string Name { get; set; }

Dependency Injection (DI) provides dependencies via constructor injection in .NET.

The IServiceCollection registers services: services.AddScoped<IMyService, MyService>();

Exception handling: try { } catch (Exception ex) { } finally { }.

using statement ensures disposal of resources: using var reader = new StreamReader(path);

Records are immutable reference types: public record Person(string Name, int Age);

Pattern matching: switch expressions, is pattern, when clauses.

Extension methods add functionality to existing types: public static int WordCount(this string str).

Attributes add metadata: [Serializable], [Obsolete("Use NewMethod")], custom attributes.
