TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

TypeScript adds static type checking at compile time, catching errors before runtime.

Basic types: string, number, boolean, null, undefined, void, never, any, unknown.

Type annotations: let name: string = "Alice"; let age: number = 30;

Interfaces define object shapes: interface User { name: string; age: number; }

Interfaces support optional properties: interface User { name: string; age?: number; }

Interfaces can be extended: interface Admin extends User { role: string; }

Type aliases create custom types: type ID = string | number;

Union types: let value: string | number; allows multiple types.

Intersection types: type AdminUser = User & Admin; combines types.

Enums define named constants: enum Direction { Up, Down, Left, Right }

String enums: enum Color { Red = "RED", Green = "GREEN" }

Generics create reusable components: function identity<T>(arg: T): T { return arg; }

Generic constraints: function getLength<T extends { length: number }>(arg: T): number

Utility types: Partial<T>, Required<T>, Readonly<T>, Pick<T, K>, Omit<T, K>, Record<K, V>.

Type guards narrow types: typeof, instanceof, and custom type predicates (x is Type).

The as keyword performs type assertions: let str = value as string;

tsconfig.json configures the TypeScript compiler: target, module, strict, outDir, rootDir.

strict mode enables all strict type-checking options.

Decorators (experimental) add metadata to classes/methods: @Component, @Injectable.

Mapped types transform existing types: type ReadonlyUser = { readonly [K in keyof User]: User[K] };

never type represents values that never occur; useful in exhaustive checks.

unknown is a type-safe alternative to any; requires type narrowing before use.
