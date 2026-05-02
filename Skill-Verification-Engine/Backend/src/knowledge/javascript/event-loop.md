The JavaScript event loop handles asynchronous operations.

The call stack executes synchronous code.

The callback queue stores asynchronous callbacks.

The event loop checks if the call stack is empty before moving callbacks
from the queue to the stack.

Promises use the microtask queue, which has higher priority than the
callback queue.

This mechanism allows JavaScript to handle non-blocking operations.
