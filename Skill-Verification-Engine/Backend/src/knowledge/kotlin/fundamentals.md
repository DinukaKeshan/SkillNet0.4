Kotlin is a modern, statically typed language that runs on the JVM, developed by JetBrains.

Kotlin is fully interoperable with Java and is the preferred language for Android development.

Variables: val (immutable) and var (mutable). Type inference: val name = "Alice".

Null safety: types are non-null by default. Use String? for nullable. Safe call: obj?.method().

The Elvis operator provides a default: val len = name?.length ?: 0.

The !! operator asserts non-null; throws NullPointerException if null.

Data classes auto-generate equals, hashCode, toString, copy: data class User(val name: String, val age: Int).

Sealed classes restrict class hierarchies: sealed class Result { class Success(val data: String) : Result() class Error(val msg: String) : Result() }.

When expression replaces switch: when (x) { 1 -> "one" 2 -> "two" else -> "other" }.

Extension functions add methods to existing classes: fun String.addExclamation() = this + "!".

Coroutines provide lightweight concurrency: launch { }, async { }, delay(), withContext().

suspend functions can be paused and resumed: suspend fun fetchData(): String.

Coroutine scopes: GlobalScope, CoroutineScope, viewModelScope (Android).

Dispatchers: Dispatchers.Main, Dispatchers.IO, Dispatchers.Default control threading.

Lambda expressions: val sum = { a: Int, b: Int -> a + b }.

Higher-order functions accept or return functions: fun operate(a: Int, b: Int, op: (Int, Int) -> Int): Int.

Collections: listOf, mutableListOf, mapOf, setOf. Functional operations: map, filter, reduce, flatMap.

Object declarations create singletons: object Database { fun connect() { } }.

Companion objects provide static-like members: companion object { fun create(): User { } }.

Android basics: Activity, Fragment, ViewModel, LiveData, RecyclerView, Jetpack Compose.
