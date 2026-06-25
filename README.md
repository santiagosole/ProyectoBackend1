# Adoptme - API de Gestión de Adopciones y Ecommerce

Este proyecto es una plataforma completa de backend para un sistema de adopciones y comercio electrónico, desarrollada sobre **Node.js**, **Express** y **MongoDB**. Implementa una arquitectura profesional en capas (Routing, Controllers, Services, Repositories, DAO y DTO), sistema de autenticación seguro, documentación automatizada con Swagger y contenedores optimizados con Docker.

---

## 📌 Estructura del Proyecto

A continuación se detalla el árbol de directorios simplificado de la aplicación con los archivos clave:

```text
backend-preentrega/
├── docker/                 # Configuraciones adicionales de contenedores
├── public/                 # Recursos estáticos (estilos, imágenes subidas)
├── src/                    # Código fuente principal de la aplicación
│   ├── config/             # Configuración de base de datos, env.js y estrategias de Passport
│   │   ├── env.js          # Centraliza todas las variables de entorno con valores por defecto
│   │   ├── db.js
│   │   └── passport.config.js
│   ├── controllers/        # Controladores que manejan la lógica de las peticiones
│   ├── dao/                # Data Access Objects para interactuar con la base de datos
│   ├── docs/               # Archivos de definición y documentación para Swagger YAML
│   ├── dto/                # Data Transfer Objects para filtrado de datos expuestos
│   ├── middlewares/        # Middlewares de control de acceso, autenticación y sesión
│   ├── models/             # Esquemas y modelos de datos de Mongoose
│   ├── repositories/       # Capa de abstracción sobre el acceso a datos (Patrón Repository)
│   ├── routes/             # Enrutadores divididos en vistas de frontend (Handlebars) y API REST
│   │   ├── api/            # Endpoints REST (sessions, users, adoptions, etc.)
│   │   └── views/          # Rutas que renderizan interfaces web
│   ├── scripts/            # Scripts de automatización y herramientas de línea de comandos
│   ├── services/           # Capa de negocio (lógica de compras, mailing, etc.)
│   ├── views/              # Plantillas Handlebars para la interfaz de usuario
│   ├── app.js              # Inicialización de Express, middlewares globales y base de datos
│   └── server.js           # Punto de entrada de la aplicación para iniciar el servidor
├── tests/                  # Suite de pruebas unitarias y de integración (Jest / Supertest)
├── Dockerfile              # Archivo de definición para la construcción de la imagen de producción
├── package.json            # Configuración de dependencias y scripts de ejecución
├── FIRE_TEST_REPORT.md     # Reporte detallado de prueba de Docker
└── README.md               # Documentación general del proyecto
```

---

## 🏛️ Arquitectura y Propósito de las Carpetas

La aplicación está organizada bajo principios de diseño escalables y separación de responsabilidades:

- **`src/config/env.js`**: Centraliza todas las variables de entorno en un solo lugar. Cada propiedad tiene un valor por defecto seguro, evitando que la aplicación falle si falta alguna variable en el entorno. Las variables se importan como `import { env } from "./config/env.js"` en lugar de usar `process.env` directamente.
- **`src/config/`**: Centraliza la inicialización de recursos clave, como la conexión de la base de datos de MongoDB Atlas y la seguridad mediante Passport.
- **`src/controllers/`**: Se encargan exclusivamente de recibir las peticiones HTTP (req) de los clientes, procesar los parámetros básicos y estructurar las respuestas (res) que se enviarán de vuelta.
- **`src/services/`**: Contienen toda la lógica de negocio del sistema (por ejemplo, validaciones avanzadas, envío de correos o procesamiento de carritos de compras). No interactúan directamente con la base de datos.
- **`src/repositories/`**: Actúan como un puente entre la lógica de negocio y la capa de persistencia (DAO), formateando y mapeando los datos que entran y salen.
- **`src/dao/` (Data Access Objects)**: Contienen las operaciones directas de lectura y escritura en la base de datos. Si se requiere cambiar de base de datos (por ejemplo, a PostgreSQL), solo se modificaría esta capa.
- **`src/dto/` (Data Transfer Objects)**: Limpian y estructuran la información que viaja hacia afuera para evitar exponer datos sensibles de la base de datos (como contraseñas).
- **`src/routes/`**: Define los puntos de acceso de la aplicación, separando las interfaces gráficas (`views`) de la lógica del servicio web (`api`).
- **`src/models/`**: Define la estructura formal de los documentos de MongoDB mediante esquemas estructurados de Mongoose.

---

## 🧪 Tests Funcionales

La aplicación cuenta con **14 tests** automatizados que cubren:

### Tests de `processData` (5 tests)
Evalúan la función de transformación de datos en diferentes modos:
- **UPPERCASE**: Transforma el input a mayúsculas
- **LOWERCASE**: Transforma el input a minúsculas
- **REVERSE**: Invierte el string
- **Undefined/Inválido**: Devuelve el input sin cambios

### Tests de `adoption.router.js` (9 tests)
Cubren todos los endpoints del router de adopciones usando **mocks** para aislar el worker externo:
- **GET /adoptions**: Lista vacía inicial y después de crear una adopción
- **POST /adoptions**: Creación exitosa, validación de campos faltantes (400), worker rejection, error del worker
- **GET /adoptions/:id**: Búsqueda por ID y 404 para ID inexistente

### Evidencia de Tests

```
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        1.344 s
```

### Cobertura de Código

```
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-------------------
All files            |   97.95 |    81.81 |     100 |   97.91 |
 src                 |     100 |      100 |     100 |     100 |
  processData.js     |     100 |      100 |     100 |     100 |
 src/config          |     100 |    76.66 |     100 |     100 |
  env.js             |     100 |    76.66 |     100 |     100 |
 src/routes          |   97.29 |       90 |     100 |   97.22 |
  adoption.router.js |   97.29 |       90 |     100 |   97.22 |
---------------------|---------|----------|---------|---------|-------------------
```

---

## 🐳 Dockerización

### Dockerfile Optimizado

Se utiliza una construcción **multi-stage** para mantener la imagen final ligera y segura:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production


FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY package*.json ./

COPY src ./src

COPY public ./public

EXPOSE 8080

CMD ["node", "src/server.js"]
```

**Decisiones de optimización:**
- **Multi-stage build**: Reduce el tamaño de la imagen final al separar la construcción de la ejecución
- **`node:22-alpine`**: Imagen base liviana (~50MB) con todas las herramientas necesarias
- **`npm ci --only=production`**: Instala solo dependencias de producción, más rápido y predecible que `npm install`
- **`COPY src ./src` + `COPY public ./public`**: Copia solo lo necesario, evitando archivos de desarrollo y configuración local
- **`CMD ["node", "src/server.js"]`**: Arranque directo sin overhead de npm

### Log de Construcción

```
[+] Building 48.6s (14/14) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load metadata for docker.io/library/node:22-alpine
 => [builder 4/4] RUN npm ci --only=production  13.4s
 => [stage-1 5/6] COPY src ./src
 => [stage-1 6/6] COPY public ./public
 => exporting to image
 => => naming to docker.io/library/backend-preentrega:v2
```

### Ejecución del Contenedor

```bash
docker run --rm -p 8080:8080 --env-file .env backend-preentrega:v2
```

### Logs de Inicio

```
Servidor escuchando en http://localhost:8080
Conexión exitosa a MongoDB.
```

---

## 🚀 Deploy en Railway

La aplicación está desplegada en **Railway** y accesible públicamente.

### Variables de Entorno Configuradas en Railway

| Variable | Valor |
|---|---|
| `MONGO_URI` | URI de MongoDB Atlas |
| `JWT_SECRET` | Secreto JWT |
| `SESSION_SECRET` | Secreto de sesión |

### Documentación de la API (Swagger)

Una vez desplegada, la documentación interactiva de Swagger está disponible en:

👉 **`https://[tu-app].railway.app/api-docs`**

---

## 🔧 Instrucciones para Ejecutar Localmente

### Prerrequisitos
- Node.js 22+
- MongoDB (local o Atlas)
- Docker (opcional)

### Instalación

```bash
cd backend-preentrega
npm install
```

### Variables de Entorno

Crear un archivo `.env` en `backend-preentrega/` con:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mi-db
JWT_SECRET=mi-secreto
SESSION_SECRET=mi-secreto-sesion
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

### Ejecutar Tests

```bash
npm test
```

### Construir y Ejecutar con Docker

```bash
docker build -t backend-preentrega:v1 .
docker run --rm -p 8080:8080 --env-file .env backend-preentrega:v1
```

---

## 📂 Repositorio

El código fuente completo está disponible en GitHub:
👉 **[https://github.com/santiagosole93/proyecto-backend1](https://github.com/santiagosole93/proyecto-backend1)**

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos como parte del curso de Backend de Coderhouse.