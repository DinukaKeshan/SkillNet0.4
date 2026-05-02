List comprehension provides a concise way to create lists: [x**2 for x in range(10)].

Conditional list comprehension: [x for x in range(20) if x % 2 == 0].

Dictionary comprehension: {k: v for k, v in zip(keys, values)}.

Set comprehension: {x**2 for x in range(10)}.

Generator expressions use parentheses and are memory-efficient: (x**2 for x in range(10)).

Generators use the yield keyword to produce values lazily one at a time.

The next() function retrieves the next value from a generator.

Generators are iterators; they maintain state between yield calls.

Decorators are functions that modify the behavior of other functions using @decorator syntax.

A decorator wraps a function: def my_decorator(func): def wrapper(*args): ... return wrapper.

Common built-in decorators: @staticmethod, @classmethod, @property.

The functools.wraps decorator preserves the original function's metadata when wrapping.
