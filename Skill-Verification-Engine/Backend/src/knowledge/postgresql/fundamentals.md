PostgreSQL is an advanced open-source relational database supporting SQL and JSON.

PostgreSQL supports standard SQL plus extensions: CTEs, window functions, JSONB, full-text search.

Data types: integer, bigint, numeric, text, varchar, boolean, date, timestamp, uuid, jsonb, array.

JSONB stores binary JSON, supports indexing and querying: column->'key', column->>'key' (text).

JSONB operators: @> (contains), ? (key exists), #> (path), jsonb_array_elements().

GIN indexes optimize JSONB and full-text search queries.

CTEs (Common Table Expressions): WITH RECURSIVE for hierarchical queries and tree traversal.

Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER (PARTITION BY ...).

LATERAL joins allow subqueries to reference columns from preceding tables.

Full-text search: to_tsvector('english', text) @@ to_tsquery('english', 'search') with GIN index.

Array type: integer[], text[]. Functions: array_agg(), unnest(), ANY(), ALL().

Composite types: CREATE TYPE address AS (street text, city text, zip text);

Schemas organize objects within a database: CREATE SCHEMA myapp; SET search_path TO myapp, public;

Sequences generate auto-incrementing values: SERIAL, BIGSERIAL, or CREATE SEQUENCE.

Constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, EXCLUDE.

UPSERT: INSERT ... ON CONFLICT (column) DO UPDATE SET ... or DO NOTHING.

Transactions: BEGIN; SAVEPOINT sp1; ROLLBACK TO sp1; COMMIT; Isolation levels: READ COMMITTED, SERIALIZABLE.

Views and materialized views: CREATE MATERIALIZED VIEW mv AS SELECT ... WITH DATA; REFRESH MATERIALIZED VIEW mv;

Stored functions: CREATE FUNCTION add(a int, b int) RETURNS int AS $$ BEGIN RETURN a + b; END; $$ LANGUAGE plpgsql;

Triggers: CREATE TRIGGER trg BEFORE INSERT ON users FOR EACH ROW EXECUTE FUNCTION my_func();

Replication basics: streaming replication for high availability, logical replication for selective table sync.

EXPLAIN ANALYZE shows query execution plan and actual timing for optimization.

Connection pooling with PgBouncer or built-in max_connections reduces overhead.
