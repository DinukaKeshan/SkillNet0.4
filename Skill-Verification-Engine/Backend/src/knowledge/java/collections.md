Java Collections Framework is in java.util package.

Main interfaces: Collection, List, Set, Queue, Map.

List is ordered and allows duplicates: ArrayList (dynamic array), LinkedList (doubly-linked).

Set does not allow duplicates: HashSet (unordered), LinkedHashSet (insertion order), TreeSet (sorted).

Map stores key-value pairs: HashMap (unordered), LinkedHashMap (insertion order), TreeMap (sorted by key).

ArrayList is backed by resizable array; fast random access.

HashMap uses hashing; allows one null key and multiple null values.

Collections.sort() sorts lists implementing Comparable or using Comparator.

Iterator is used to traverse collections.

for-each loop (enhanced for) is convenient for iteration.

Generics ensure type safety in collections (e.g. List<String>).