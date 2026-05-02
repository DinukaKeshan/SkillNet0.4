C++ is an extension of C that adds object-oriented, generic, and functional programming features.

C++ supports classes and objects: class MyClass { public: int x; void display(); };

Access specifiers: public, private, protected control member visibility.

Constructors initialize objects; destructors (~ClassName) clean up resources.

Inheritance: class Derived : public Base { }; supports public, private, protected inheritance.

C++ supports multiple inheritance: class C : public A, public B { };

Virtual functions enable runtime polymorphism: virtual void draw() = 0; (pure virtual = abstract).

The override keyword explicitly marks overriding virtual functions.

Templates enable generic programming: template<typename T> T max(T a, T b) { return a > b ? a : b; }

Class templates: template<typename T> class Stack { T data[100]; int top; };

The STL (Standard Template Library) provides containers, algorithms, and iterators.

Common STL containers: vector, list, deque, map, unordered_map, set, stack, queue, priority_queue.

Iterators traverse containers: for (auto it = vec.begin(); it != vec.end(); ++it).

Range-based for loop: for (auto& elem : vec) { }.

Smart pointers manage memory automatically: unique_ptr, shared_ptr, weak_ptr (from <memory>).

unique_ptr has exclusive ownership; cannot be copied, only moved.

shared_ptr uses reference counting; the object is deleted when the last shared_ptr is destroyed.

RAII (Resource Acquisition Is Initialization) ties resource lifetime to object lifetime.

Move semantics (std::move) transfer ownership of resources without copying.

Rvalue references (T&&) enable move constructors and move assignment operators.

Operator overloading: MyClass operator+(const MyClass& other) { };

The new and delete operators allocate/free heap memory; prefer smart pointers instead.

Namespaces prevent naming conflicts: namespace MyLib { class Foo { }; }

Lambda expressions: auto add = [](int a, int b) { return a + b; };

constexpr allows compile-time evaluation of functions and variables.
