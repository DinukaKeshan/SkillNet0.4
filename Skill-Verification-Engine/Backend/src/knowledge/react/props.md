Props (properties) are inputs to a component.

They are passed from parent to child components.

Props are immutable (read-only) inside the child component.

Props can be any valid JavaScript value: strings, numbers, objects, arrays, functions, etc.

Default props can be defined using defaultProps or default parameters.

PropTypes can be used for type checking props (mostly in non-TypeScript projects).

Destructuring props in functional components is common: function MyComponent({ name, age }).

Children prop allows passing content between opening and closing tags.

Props drilling is passing props through many levels; solved by Context API or state management libraries.

Props are used for communication from parent to child.