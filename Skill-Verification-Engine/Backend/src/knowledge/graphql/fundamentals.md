GraphQL is a query language for APIs that allows clients to request exactly the data they need.

GraphQL uses a single endpoint (typically /graphql) instead of multiple REST endpoints.

Schema Definition Language (SDL) defines types: type User { id: ID! name: String! email: String }

Queries read data: query { users { id name } }. Only requested fields are returned.

Mutations modify data: mutation { createUser(name: "Alice") { id name } }.

Subscriptions provide real-time updates via WebSocket: subscription { messageAdded { text author } }.

Resolvers are functions that return data for each field: const resolvers = { Query: { users: () => db.getUsers() } }.

Type system: scalar types (String, Int, Float, Boolean, ID), object types, input types, enum types.

Non-nullable fields use !: name: String! means name can never be null.

Lists: [String] is a list of strings. [String!]! is a non-null list of non-null strings.

Input types for mutations: input CreateUserInput { name: String! email: String! }.

Fragments reuse field selections: fragment UserFields on User { id name email }.

Variables parameterize queries: query GetUser($id: ID!) { user(id: $id) { name } }.

The N+1 problem: fetching a list then loading related data individually. Solved with DataLoader (batching + caching).

DataLoader batches multiple requests into a single database query.

Apollo Server is a popular GraphQL server for Node.js.

Apollo Client manages GraphQL data on the frontend with caching: useQuery, useMutation, useSubscription hooks.

Introspection allows clients to query the schema itself: { __schema { types { name } } }.

Schema stitching and federation combine multiple GraphQL services into a single graph.

Authentication in GraphQL: pass tokens in HTTP headers; validate in context function.

Error handling: errors array in the response alongside data: { data: null, errors: [{ message: "..." }] }.

Pagination patterns: offset-based, cursor-based (Relay-style: edges, nodes, pageInfo).
