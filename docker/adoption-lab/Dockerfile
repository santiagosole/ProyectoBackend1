# Imagen base optimizada de Node.js en Alpine Linux
FROM node:18-alpine

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json para la instalación de dependencias
COPY package.json ./

# Instalar dependencias del simulador (por ejemplo, cross-env para soporte de scripts de entorno)
RUN npm install --only=production

# Copiar el código fuente del simulador
COPY index.js validationWorker.js ./

# Definir la variable de entorno por defecto (puede ser sobreescrita al ejecutar el contenedor)
ENV SIMULATION_MODE=normal

# Comando de inicio del simulador que consume la entrada estándar (stdin)
CMD ["node", "index.js"]
