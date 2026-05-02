FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY src/ ./src/

EXPOSE 5005

CMD ["node", "src/server.js"]
