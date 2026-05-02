Hooks are functions that let you use state and lifecycle features in functional components.

useState hook manages local component state.

useEffect hook handles side effects (data fetching, subscriptions, DOM updates).

useEffect runs after render; can return a cleanup function.

Dependency array controls when useEffect runs: empty [] for mount only, no array for every render.

useContext provides access to context values without prop drilling.

useReducer is an alternative to useState for complex state logic.

useRef creates a mutable reference that persists across renders (useful for DOM access).

useMemo memoizes expensive calculations.

useCallback memoizes functions to prevent unnecessary re-creations.

Custom hooks allow code reuse by extracting logic into reusable functions.