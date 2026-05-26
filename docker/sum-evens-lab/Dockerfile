# syntax=docker/dockerfile:1
# Build desde esta carpeta (docker build .). .dockerignore evita copiar node_modules local, logs, .git, etc.

# --- ETAPA 1: INSTALACIÓN DE DEPENDENCIAS ---
# Usamos alpine por ser una distro súper liviana y rápida
FROM node:22-alpine AS deps
WORKDIR /app

# Copiamos package.json y package-lock.json para gestionar la caché de Docker
COPY package.json package-lock.json ./

# Instalamos únicamente dependencias de producción y limpiamos caché para ahorrar espacio
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# --- ETAPA 2: IMAGEN FINAL ---
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copiamos solo node_modules ya filtrado y el código fuente para mantener la imagen limpia
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# Corremos la app con el usuario 'node' sin privilegios root por seguridad
USER node

# Comando por defecto para correr nuestra app
CMD ["node", "src/index.mjs"]
