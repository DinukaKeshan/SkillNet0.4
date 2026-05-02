C is a low-level, procedural, compiled programming language developed by Dennis Ritchie.

C programs start execution from the main() function: int main(void) { return 0; }

C is statically typed; all variables must be declared with a type before use.

Primitive types: int, char, float, double, short, long, unsigned.

sizeof operator returns the size in bytes of a type or variable.

Pointers store memory addresses: int *ptr = &x; *ptr dereferences the pointer.

Pointer arithmetic: ptr++ moves to the next element of the pointed-to type.

NULL pointer: a pointer that points to nothing; dereferencing NULL causes undefined behavior.

Arrays are contiguous memory blocks: int arr[5] = {1, 2, 3, 4, 5}; accessed via arr[i].

Arrays decay to pointers when passed to functions.

Strings are null-terminated char arrays: char str[] = "hello"; ending with '\0'.

String functions from string.h: strlen, strcpy, strcat, strcmp, strncpy.

Structs group related data: struct Point { int x; int y; };

typedef creates type aliases: typedef struct { int x; int y; } Point;

Dynamic memory allocation: malloc(), calloc(), realloc(), free() from stdlib.h.

Memory leaks occur when dynamically allocated memory is not freed.

File I/O: fopen(), fclose(), fprintf(), fscanf(), fgets(), fputs(), fread(), fwrite().

Preprocessor directives: #include, #define, #ifdef, #ifndef, #endif, #pragma.

Macros defined with #define are text substitutions performed before compilation.

Header files (.h) contain declarations; source files (.c) contain definitions.

Compilation stages: preprocessing → compilation → assembly → linking.

The static keyword limits scope to the file (for globals) or preserves value between calls (for locals).

const qualifier makes a variable read-only: const int MAX = 100;
