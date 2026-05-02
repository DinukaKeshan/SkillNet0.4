State is a built-in object that holds data that can change over time.

In functional components, state is managed with the useState hook.

useState returns an array with two elements: current state value and setter function.

State updates are asynchronous and batched for performance.

Direct mutation of state is not allowed; always use the setter function.

When state depends on previous state, use the functional update form: setCount(prev => prev + 1).

State changes trigger re-renders of the component.

Each component has its own isolated state.

Lifting state up means moving shared state to the closest common ancestor.

For complex state logic, useReducer hook is often preferred over useState.