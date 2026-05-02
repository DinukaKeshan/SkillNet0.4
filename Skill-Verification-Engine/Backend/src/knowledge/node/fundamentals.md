Node.js is a JavaScript runtime built on Chrome's V8 engine for server-side programming.

Node.js uses an event-driven, non-blocking I/O model that makes it efficient for I/O-heavy workloads.

The event loop processes callbacks from the callback queue after the call stack is empty.

Event loop phases: timers, pending callbacks, idle/prepare, poll, check (setImmediate), close callbacks.

process.nextTick() executes before the next event loop iteration; setImmediate() executes in the check phase.

Modules: CommonJS uses require/module.exports; ES Modules use import/export with "type": "module" in package.json.

The require() function caches modules after first load; subsequent calls return the cached version.

Streams process data in chunks: Readable, Writable, Duplex, Transform. Pipe connects streams: readable.pipe(writable).

Buffers represent fixed-length binary data: Buffer.from("hello"), Buffer.alloc(10).

The fs module provides file system operations: readFile, writeFile, createReadStream, createWriteStream.

path module: path.join(), path.resolve(), path.basename(), path.extname().

The http module creates servers: http.createServer((req, res) => { res.end("Hello"); }).listen(3000).

npm (Node Package Manager) manages dependencies. package.json defines project metadata and scripts.

npm scripts: "scripts": { "start": "node index.js", "dev": "nodemon index.js" }.

npx runs packages without installing: npx create-react-app my-app.

Environment variables: process.env.NODE_ENV, process.env.PORT. Loaded from .env files with dotenv.

The cluster module forks worker processes to utilize multiple CPU cores.

child_process module: exec(), spawn(), fork() for running external commands and processes.

EventEmitter is the foundation of event-driven architecture: emitter.on('event', callback); emitter.emit('event').

Global objects: process, console, __dirname, __filename, setTimeout, setInterval.

Error handling: try/catch for sync code; .catch() or async/await with try/catch for promises.
