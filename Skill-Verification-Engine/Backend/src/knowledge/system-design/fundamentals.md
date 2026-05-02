System design is the process of defining architecture, components, and data flow for scalable systems.

Scalability means handling increased load. Vertical scaling (bigger machine) vs horizontal scaling (more machines).

Load balancers distribute traffic across servers: round-robin, least connections, IP hash. Tools: Nginx, HAProxy, AWS ALB.

Reverse proxies sit in front of servers, handling SSL termination, caching, and load balancing.

Caching stores frequently accessed data for faster retrieval. Layers: browser, CDN, application (Redis/Memcached), database query cache.

Cache invalidation strategies: TTL (time-to-live), write-through, write-behind, cache-aside (lazy loading).

CDN (Content Delivery Network) serves static content from edge servers close to users, reducing latency.

The CAP theorem: distributed systems can guarantee only two of three: Consistency, Availability, Partition tolerance.

Microservices architecture splits applications into small, independently deployable services.

Monolithic architecture: single deployable unit. Simpler but harder to scale individual components.

Service communication: synchronous (HTTP/REST, gRPC) or asynchronous (message queues).

Message queues decouple producers and consumers: RabbitMQ, Apache Kafka, AWS SQS.

Event-driven architecture: services react to events published to a message broker.

Database sharding partitions data across multiple databases for horizontal scaling.

Replication: master-slave (read replicas) or master-master for high availability and read throughput.

Consistent hashing distributes data across nodes, minimizing redistribution when nodes are added/removed.

Rate limiting prevents abuse: token bucket, sliding window, fixed window algorithms.

API Gateway: single entry point for microservices; handles routing, auth, rate limiting, and monitoring.

Eventual consistency: updates propagate asynchronously; the system becomes consistent over time.

SQL databases (ACID) for strong consistency; NoSQL databases (BASE) for availability and partition tolerance.

Websockets provide full-duplex communication for real-time features (chat, notifications).

Monitoring and observability: metrics (Prometheus/Grafana), logging (ELK stack), tracing (Jaeger).

Horizontal partitioning (sharding) vs vertical partitioning (splitting tables by columns).
