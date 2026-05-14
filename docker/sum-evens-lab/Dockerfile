# syntax=docker/dockerfile:1
# Build desde esta carpeta (docker build .). .dockerignore evita copiar node_modules local, logs, .git, etc.

# Etapa 1: solo dependencias de producción (omit devDependencies como nodemon)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Etapa 2: imagen final mínima — solo runtime + app
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

USER node

CMD ["node", "src/index.mjs"]
