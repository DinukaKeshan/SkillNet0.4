Express.js is a minimal, flexible Node.js web application framework.

Express apps are created with: const app = express(); app.listen(3000).

Middleware functions have access to req, res, and next: app.use((req, res, next) => { next(); }).

Middleware executes in order; call next() to pass control to the next middleware.

Built-in middleware: express.json() parses JSON bodies; express.static() serves static files.

Popular third-party middleware: cors, helmet, morgan, compression, cookie-parser.

Routing: app.get('/users', handler), app.post('/users', handler), app.put, app.delete, app.patch.

Route parameters: app.get('/users/:id', (req, res) => { const id = req.params.id; }).

Query parameters: /search?q=term accessed via req.query.q.

Request body: req.body (after express.json() middleware).

Router modules organize routes: const router = express.Router(); router.get('/', handler); app.use('/api', router).

Error-handling middleware has four arguments: (err, req, res, next) and is defined last.

Centralized error handling: app.use((err, req, res, next) => { res.status(500).json({ error: err.message }); }).

RESTful patterns: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove).

Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.

Authentication: JWT tokens in Authorization header; middleware verifies tokens before protected routes.

CORS: app.use(cors({ origin: 'http://localhost:3000', credentials: true })).

Template engines: EJS, Pug, Handlebars — app.set('view engine', 'ejs'); res.render('index', data).

res.json() sends JSON; res.send() sends text/HTML; res.status(404).json({ error: 'Not found' }).

app.use('/uploads', express.static('uploads')) serves uploaded files publicly.

Request validation: use libraries like Joi or express-validator to validate req.body.
