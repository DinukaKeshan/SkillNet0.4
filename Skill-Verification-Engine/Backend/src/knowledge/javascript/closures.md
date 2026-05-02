A closure is created when a function remembers variables from its lexical scope
even after the outer function has finished execution.

Closures allow functions to access variables from an enclosing scope.

Closures are commonly used for data encapsulation and creating private variables.

Example of a closure:

function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

In this example, the inner function retains access to the count variable even
after the outer function has returned.
