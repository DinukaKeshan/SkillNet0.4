Data structures organize and store data efficiently. Algorithms are step-by-step procedures to solve problems.

Big O notation describes algorithm efficiency: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2^n) exponential.

Arrays store elements in contiguous memory. Access O(1), search O(n), insertion/deletion O(n).

Dynamic arrays (ArrayList, vector) resize automatically when capacity is exceeded.

Linked lists consist of nodes with data and pointers. Singly linked: next pointer. Doubly linked: next and prev.

Linked list operations: insertion O(1) at head, search O(n), deletion O(1) if node is known.

Stacks follow LIFO (Last In, First Out): push, pop, peek. Used for undo operations, expression evaluation, DFS.

Queues follow FIFO (First In, First Out): enqueue, dequeue. Used for BFS, scheduling, buffering.

Hash tables map keys to values using a hash function. Average access O(1). Collision resolution: chaining, open addressing.

Binary trees have at most two children per node. Binary Search Trees (BST): left < root < right.

BST operations: search O(log n) average, O(n) worst; insert O(log n) average.

Balanced BSTs (AVL, Red-Black trees) maintain O(log n) height through rotations.

Heaps are complete binary trees: min-heap (parent ≤ children), max-heap (parent ≥ children). Used for priority queues.

Graphs consist of vertices and edges. Representations: adjacency matrix (O(V²) space), adjacency list (O(V+E) space).

Graph traversals: BFS (Breadth-First Search) uses a queue; DFS (Depth-First Search) uses a stack or recursion.

Sorting algorithms: Bubble Sort O(n²), Selection Sort O(n²), Insertion Sort O(n²), Merge Sort O(n log n), Quick Sort O(n log n) average, Heap Sort O(n log n).

Merge Sort: divide array in halves, sort recursively, merge sorted halves. Stable, O(n log n).

Quick Sort: choose pivot, partition around pivot, recurse. Average O(n log n), worst O(n²).

Binary Search: find element in sorted array by halving search space. O(log n).

Recursion: a function calls itself. Requires a base case and recursive case. Uses the call stack.

Dynamic Programming: solve complex problems by breaking them into overlapping subproblems. Memoization (top-down) vs tabulation (bottom-up).

Classic DP problems: Fibonacci, knapsack, longest common subsequence, coin change, edit distance.

Greedy algorithms make locally optimal choices at each step, hoping for global optimum.

Dijkstra's algorithm finds shortest paths from a source to all vertices in a weighted graph with non-negative weights.

Tries (prefix trees) store strings character by character; efficient for prefix-based search and autocomplete.
