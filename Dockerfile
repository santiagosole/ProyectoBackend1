# Stage 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Stage 2: Runtime
FROM node:23-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY package*.json ./

COPY src ./src

EXPOSE 8080

CMD ["node", "src/server.js"]
