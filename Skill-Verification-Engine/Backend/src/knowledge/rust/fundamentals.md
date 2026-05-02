Rust is a systems programming language focused on safety, speed, and concurrency.

Rust guarantees memory safety without a garbage collector through its ownership system.

Every value has a single owner. When the owner goes out of scope, the value is dropped.

Ownership can be transferred (moved): let s2 = s1; after this, s1 is no longer valid.

Borrowing creates references without taking ownership: &x (immutable) or &mut x (mutable).

At any time, you can have either one mutable reference or any number of immutable references.

Lifetimes annotate how long references are valid: fn longest<'a>(x: &'a str, y: &'a str) -> &'a str.

The borrow checker enforces ownership, borrowing, and lifetime rules at compile time.

Variables are immutable by default: let x = 5; Use let mut x = 5; for mutability.

Traits define shared behavior: trait Summary { fn summarize(&self) -> String; }

impl Trait for Type implements a trait: impl Summary for Article { fn summarize(&self) -> String { } }

Enums can hold data: enum Message { Quit, Move { x: i32, y: i32 }, Write(String) }.

Option<T> represents optional values: Some(value) or None. No null in Rust.

Result<T, E> represents success or failure: Ok(value) or Err(error).

Pattern matching with match is exhaustive: match value { Some(x) => x, None => 0 }.

if let provides concise matching for single patterns: if let Some(x) = option { }.

Structs: struct Point { x: f64, y: f64 }. Methods via impl Point { fn distance(&self) -> f64 { } }.

Cargo is Rust's package manager and build system. cargo new, cargo build, cargo run, cargo test.

Crates are compilation units; packages contain one or more crates.

Cargo.toml defines dependencies and metadata.

unsafe blocks allow dereferencing raw pointers, calling unsafe functions, and accessing mutable statics.

The ? operator propagates errors: let data = fs::read_to_string("file.txt")?;

Closures capture environment: let add = |a, b| a + b; or move || for ownership transfer.

Iterators: .iter(), .map(), .filter(), .collect(). Zero-cost abstractions.
