# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_SVE_API_URL=http://localhost:5005/api
ARG VITE_SKILLNET_GATEWAY_URL=http://localhost:5000

ENV VITE_SVE_API_URL=$VITE_SVE_API_URL
ENV VITE_SKILLNET_GATEWAY_URL=$VITE_SKILLNET_GATEWAY_URL

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
