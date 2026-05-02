Go (Golang) is a statically typed, compiled language designed by Google for simplicity and concurrency.

Go programs start from the main function in package main: func main() { }.

Go uses explicit error handling; no exceptions. Functions return (result, error) tuples.

The error interface: type error interface { Error() string }. Errors are values.

if err != nil { return err } is the idiomatic error-handling pattern.

Variables are declared with var or short declaration: x := 42.

Go has basic types: int, float64, string, bool, byte, rune.

Structs group data: type Person struct { Name string; Age int }.

Methods have receivers: func (p Person) Greet() string { return "Hi, " + p.Name }.

Interfaces are satisfied implicitly; no implements keyword. type Reader interface { Read([]byte) (int, error) }.

The empty interface interface{} (or any in Go 1.18+) accepts any type.

Goroutines are lightweight concurrent functions launched with go: go myFunction().

Channels communicate between goroutines: ch := make(chan int); ch <- 42; val := <-ch.

Buffered channels: make(chan int, 10) allows sending without an immediate receiver.

The select statement waits on multiple channel operations.

sync.WaitGroup coordinates goroutine completion: wg.Add(1), defer wg.Done(), wg.Wait().

sync.Mutex provides mutual exclusion for shared data.

Packages organize code; imported via import "fmt". Exported names start with an uppercase letter.

go mod init initializes a Go module. go.mod tracks dependencies.

go get adds dependencies; go build compiles; go test runs tests.

Slices are dynamic views over arrays: s := []int{1, 2, 3}. append() grows slices.

Maps are hash tables: m := map[string]int{"a": 1}. Accessed via m["a"].

defer postpones execution until the surrounding function returns.

Pointers exist but no pointer arithmetic: p := &x; *p dereferences.
