Python supports OOP with classes defined using the class keyword.

The __init__ method is the constructor, called when an object is created.

self refers to the current instance; it must be the first parameter of instance methods.

Inheritance: class Child(Parent) inherits attributes and methods from Parent.

Python supports multiple inheritance: class C(A, B).

Method Resolution Order (MRO) determines method lookup order in multiple inheritance.

Encapsulation uses naming conventions: _protected and __private (name mangling).

Polymorphism: different classes can define the same method name with different behavior.

The super() function calls the parent class method.

@property decorator creates getter/setter properties.

Abstract classes use the abc module: from abc import ABC, abstractmethod.

Magic methods (dunder): __str__, __repr__, __len__, __eq__, __lt__, __add__, __getitem__.

async and await keywords enable asynchronous programming with asyncio.

asyncio.run() starts the event loop. await pauses execution until an awaitable completes.

async for iterates over asynchronous iterables; async with manages async context managers.

pip is Python's package manager. pip install package_name installs packages.

Virtual environments isolate project dependencies: python -m venv myenv.

Common standard library modules: os, sys, json, re, datetime, collections, itertools, functools.
