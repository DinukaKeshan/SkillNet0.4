Hoisting is JavaScript's behavior of moving variable and function
declarations to the top of their scope during compilation.

Function declarations are fully hoisted and can be called before they
are defined.

Variables declared with var are hoisted but initialized as undefined.

Variables declared with let and const are hoisted but are not initialized,
resulting in a temporal dead zone.

Accessing a let or const variable before declaration causes a ReferenceError.
