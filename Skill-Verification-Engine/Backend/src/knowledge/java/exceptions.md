Exceptions are runtime errors that disrupt normal flow.

Two types: checked (compile-time) and unchecked (runtime).

Checked exceptions must be handled or declared (throws).

try-catch block handles exceptions.

finally block always executes (cleanup).

throw keyword manually throws an exception.

throws keyword in method signature declares possible exceptions.

Exception hierarchy: Throwable → Error and Exception → RuntimeException (unchecked).

Common unchecked: NullPointerException, ArrayIndexOutOfBoundsException.

try-with-resources automatically closes resources (Java 7+).

Custom exceptions can extend Exception or RuntimeException.