Docker is a platform for building, shipping, and running applications in containers.

Containers are lightweight, isolated environments that package an application with its dependencies.

Images are read-only templates used to create containers. Built from Dockerfiles.

A Dockerfile defines how to build an image: FROM, RUN, COPY, ADD, CMD, ENTRYPOINT, EXPOSE, ENV, WORKDIR.

FROM sets the base image: FROM node:18-alpine. Multi-stage builds use multiple FROM statements.

RUN executes commands during build: RUN npm install. Each RUN creates a new layer.

COPY copies files from host to image: COPY package.json ./. ADD is similar but supports URLs and tar extraction.

CMD specifies the default command when a container starts: CMD ["node", "server.js"].

ENTRYPOINT sets the executable; CMD provides default arguments: ENTRYPOINT ["node"] CMD ["server.js"].

EXPOSE documents which ports the container listens on: EXPOSE 3000 (informational, not published).

docker build -t myapp:latest . builds an image from a Dockerfile.

docker run -d -p 3000:3000 --name myapp myapp:latest runs a container.

docker run flags: -d (detached), -p (port mapping), -v (volume mount), -e (environment variable), --name.

docker ps lists running containers; docker ps -a lists all. docker stop/start/restart manage containers.

docker exec -it myapp bash opens an interactive shell inside a running container.

docker logs myapp shows container output.

Volumes persist data beyond container lifecycle: docker volume create mydata; -v mydata:/app/data.

Bind mounts map host directories: -v $(pwd)/src:/app/src for development.

docker-compose.yml defines multi-container applications: services, networks, volumes.

Docker Compose commands: docker-compose up -d, docker-compose down, docker-compose build, docker-compose logs.

Docker networking: bridge (default), host, overlay (Swarm). Containers on the same network communicate by service name.

Docker registries store images: Docker Hub (public), ECR, GCR, ACR (private).

.dockerignore excludes files from the build context: node_modules, .git, .env.

Layer caching: unchanged layers are cached. Order Dockerfile instructions from least to most frequently changing.

Health checks: HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1.
