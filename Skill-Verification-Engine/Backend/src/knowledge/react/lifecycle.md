Class components have lifecycle methods; functional components use useEffect for similar behavior.

Mounting phase: constructor → getDerivedStateFromProps → render → componentDidMount.

Updating phase: getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate.

Unmounting phase: componentWillUnmount (cleanup).

useEffect with empty dependency array acts like componentDidMount.

useEffect with cleanup function acts like componentWillUnmount.

useEffect with dependencies acts like componentDidUpdate for specific values.

React 16.3+ introduced getDerivedStateFromProps and getSnapshotBeforeUpdate (rarely used).

Modern React prefers functional components + hooks over class lifecycle methods.

StrictMode helps detect unsafe lifecycle usage.

Avoid side effects in render phase.