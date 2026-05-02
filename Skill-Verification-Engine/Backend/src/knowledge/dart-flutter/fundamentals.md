Dart is a client-optimized language developed by Google, used with the Flutter framework.

Dart is statically typed with type inference: var name = "Alice"; or String name = "Alice";

Everything in Dart is an object, including numbers and functions.

Null safety: types are non-nullable by default. Use String? for nullable. The ! operator asserts non-null.

Late variables: late String description; initialized before first use.

Functions are first-class: can be assigned to variables, passed as arguments, and returned.

Arrow syntax for single-expression functions: int square(int x) => x * x;

Named parameters: void greet({required String name, int age = 0}) { }.

Async programming: Future<T> represents a future value. async/await pattern.

Streams deliver asynchronous sequences of data: Stream<int>.listen((val) { }).

The await for loop iterates over stream values.

Flutter is Google's UI toolkit for building natively compiled apps from a single codebase.

Everything in Flutter is a widget. The widget tree defines the UI.

StatelessWidget: immutable UI components. StatefulWidget: mutable UI with setState().

The build() method describes the widget's UI. Called whenever state changes.

Common widgets: Container, Row, Column, Stack, ListView, GridView, Text, Image, Scaffold.

Material Design widgets: AppBar, FloatingActionButton, BottomNavigationBar, Card, Drawer.

State management approaches: setState, Provider, Riverpod, Bloc, GetX.

Hot reload applies code changes instantly without losing app state during development.

Pub is Dart's package manager. pubspec.yaml defines dependencies.

pub get downloads dependencies; pub upgrade updates to latest compatible versions.

Navigation: Navigator.push/pop, named routes, or GoRouter package.

BuildContext provides the widget's location in the tree for accessing inherited widgets.

Keys help Flutter identify which widgets changed: ValueKey, ObjectKey, UniqueKey.
