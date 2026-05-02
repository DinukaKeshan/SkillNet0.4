REST (Representational State Transfer) is an architectural style for designing networked APIs.

RESTful APIs use HTTP methods: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove).

Resources are identified by URLs: /api/users, /api/users/123, /api/users/123/orders.

HTTP status codes indicate results: 2xx success, 3xx redirection, 4xx client error, 5xx server error.

Common status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error.

REST APIs should be stateless; each request contains all information needed to process it.

JSON is the most common response format for REST APIs.

Authentication methods: API keys, JWT (JSON Web Tokens), OAuth 2.0, Basic Auth.

JWT consists of three parts: header, payload, signature. Encoded as base64url separated by dots.

OAuth 2.0 flows: Authorization Code, Client Credentials, Implicit, Resource Owner Password.

API versioning strategies: URL path (/api/v2/users), query param (?version=2), header (Accept: application/vnd.api.v2+json).

Rate limiting prevents abuse: 429 Too Many Requests with Retry-After header.

Pagination: offset/limit, cursor-based, or page/pageSize query parameters.

HATEOAS: responses include links to related actions and resources.

OpenAPI (Swagger) is a specification for describing REST APIs; enables auto-generated docs and client SDKs.

Content negotiation: Accept header specifies desired response format (application/json, application/xml).

CORS (Cross-Origin Resource Sharing) controls which origins can access the API.

Idempotency: GET, PUT, DELETE are idempotent; POST is not. Idempotency keys prevent duplicate operations.

Request validation: validate body, params, query, and headers before processing.

Error response format: { "error": { "code": "VALIDATION_ERROR", "message": "Email is required" } }.
