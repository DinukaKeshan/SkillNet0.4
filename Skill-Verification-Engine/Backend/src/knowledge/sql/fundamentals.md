SQL (Structured Query Language) is the standard language for managing and querying relational databases.

SELECT retrieves data: SELECT column1, column2 FROM table WHERE condition;

SELECT DISTINCT removes duplicate rows from results.

WHERE filters rows: WHERE age > 18 AND city = 'NYC' OR status = 'active'.

ORDER BY sorts results: ORDER BY name ASC, age DESC.

LIMIT restricts the number of rows returned: SELECT * FROM users LIMIT 10 OFFSET 20;

INSERT adds new rows: INSERT INTO users (name, age) VALUES ('Alice', 30);

UPDATE modifies existing rows: UPDATE users SET age = 31 WHERE id = 1;

DELETE removes rows: DELETE FROM users WHERE id = 1;

JOINs combine rows from two or more tables based on related columns.

INNER JOIN returns matching rows from both tables.

LEFT JOIN returns all rows from the left table and matched rows from the right (NULL if no match).

RIGHT JOIN returns all rows from the right table and matched rows from the left.

FULL OUTER JOIN returns all rows from both tables, with NULLs for non-matching rows.

CROSS JOIN produces a Cartesian product of both tables.

Subqueries are queries nested inside another query: SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);

Aggregate functions: COUNT(), SUM(), AVG(), MIN(), MAX(). Used with GROUP BY.

GROUP BY groups rows that share values: SELECT city, COUNT(*) FROM users GROUP BY city;

HAVING filters groups: SELECT city, COUNT(*) FROM users GROUP BY city HAVING COUNT(*) > 5;

Indexes speed up queries: CREATE INDEX idx_name ON users(name); B-tree indexes are most common.

Transactions ensure ACID properties: BEGIN; UPDATE ...; COMMIT; or ROLLBACK;

Normalization reduces redundancy: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies).

Stored procedures are reusable SQL code blocks: CREATE PROCEDURE GetUsers() BEGIN SELECT * FROM users; END;

Window functions perform calculations across rows: ROW_NUMBER(), RANK(), DENSE_RANK(), SUM() OVER (PARTITION BY ...).

CTEs (Common Table Expressions): WITH cte AS (SELECT ...) SELECT * FROM cte;

Foreign keys enforce referential integrity: FOREIGN KEY (user_id) REFERENCES users(id).

Views are virtual tables: CREATE VIEW active_users AS SELECT * FROM users WHERE active = 1;

UNION combines results from two queries (removes duplicates); UNION ALL keeps duplicates.
