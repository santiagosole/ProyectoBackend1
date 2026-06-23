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
│   ├── config/             # Configuración de base de datos y estrategias de Passport
│   │   ├── db.js
│   │   └── passport.config.js
│   ├── controllers/        # Controladores que manejan la lógica de las peticiones
│   │   ├── cart.controller.js
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   ├── dao/                # Data Access Objects para interactuar con la base de datos
│   │   ├── carts.dao.js
│   │   ├── products.dao.js
│   │   └── users.dao.js
│   ├── docs/               # Archivos de definición y documentación para Swagger YAML
│   ├── dto/                # Data Transfer Objects para filtrado de datos expuestos
│   ├── middlewares/        # Middlewares de control de acceso, autenticación y sesión
│   ├── models/             # Esquemas y modelos de datos de Mongoose
│   │   ├── Cart.js
│   │   ├── Product.js
│   │   ├── Ticket.js
│   │   └── User.model.js
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
└── README.md               # Documentación general del proyecto
```

---

## 🏛️ Arquitectura y Propósito de las Carpetas

La aplicación está organizada bajo principios de diseño escalables y separación de responsabilidades:

- **`src/config/`**: Centraliza la inicialización de recursos clave, como la conexión de la base de datos de MongoDB Atlas y la seguridad mediante Passport.
- **`src/controllers/`**: Se encargan exclusivamente de recibir las peticiones HTTP (req) de los clientes, procesar los parámetros básicos y estructurar las respuestas (res) que se enviarán de vuelta.
- **`src/services/`**: Contienen toda la lógica de negocio del sistema (por ejemplo, validaciones avanzadas, envío de correos o procesamiento de carritos de compras). No interactúan directamente con la base de datos.
- **`src/repositories/`**: Actúan como un puente entre la lógica de negocio y la capa de persistencia (DAO), formateando y mapeando los datos que entran y salen.
- **`src/dao/` (Data Access Objects)**: Contienen las operaciones directas de lectura y escritura en la base de datos. Si se requiere cambiar de base de datos (por ejemplo, a PostgreSQL), solo se modificaría esta capa.
- **`src/dto/` (Data Transfer Objects)**: Limpian y estructuran la información que viaja hacia afuera para evitar exponer datos sensibles de la base de datos (como contraseñas).
- **`src/routes/`**: Define los puntos de acceso de la aplicación, separando las interfaces gráficas (`views`) de la lógica del servicio web (`api`).
- **`src/models/`**: Define la estructura formal de los documentos de MongoDB mediante esquemas estructurados de Mongoose.

---

## 🐳 Instrucciones de Docker

El proyecto está preparado para ejecutarse dentro de un entorno aislado utilizando contenedores de Docker. Se utiliza una construcción optimizada en múltiples etapas (multi-stage build) para mantener la imagen final ligera y segura.

### 1. Construir la Imagen de Docker

Asegúrate de estar en el directorio raíz donde se encuentra el archivo `Dockerfile`. Ejecuta el siguiente comando para compilar la imagen:

```bash
docker build -t adoption-api:1.0 .
```

*Nota: Esto instalará solo las dependencias de producción y creará una imagen limpia basada en Alpine Linux.*

### 2. Ejecutar el Contenedor con Variables de Entorno

Una vez compilada la imagen, puedes levantar el contenedor pasando las variables de entorno definidas en tu archivo `.env`. Ejecuta el siguiente comando:

```bash
docker run -d --name adoption-container -p 8081:8080 --env-file .env adoption-api:1.0
```

Este comando:
- Ejecuta el contenedor en segundo plano (`-d`).
- Le asigna el nombre `adoption-container`.
- Mapea el puerto local `8081` al puerto interno del contenedor `8080` (`-p 8081:8080`).
- Carga las credenciales y configuraciones directamente desde el archivo `.env` (`--env-file .env`).

### 3. Verificar el Funcionamiento

Puedes verificar que el contenedor se está ejecutando correctamente con:

```bash
docker ps
```

Y revisar los registros de arranque del servidor utilizando:

```bash
docker logs adoption-container
```

---

## 🧪 Ejecutar la Suite de Pruebas (Tests)

La aplicación cuenta con pruebas automatizadas integradas para validar la robustez del código.

### Requisitos Previos

Asegúrate de tener instaladas las dependencias de desarrollo localmente:

```bash
npm install
```

### Ejecutar los Tests de Integración

Para correr las pruebas implementadas (por ejemplo, usando Mocha/Chai o Jest), ejecuta el siguiente comando en la consola:

```bash
npm test
```

Este comando levantará el entorno de pruebas, ejecutará los assertions y te dará un reporte en consola detallando el estado de cada test.

---

## 🚀 Repositorio de DockerHub & Logs de Ejecución

A continuación, se adjuntan los accesos al contenedor distribuido y la evidencia del funcionamiento local:

### Imagen Oficial en DockerHub
👉 **`santiagosole93/adoption-api:1.0`**

Para descargar y ejecutar esta imagen directamente desde tu terminal, utilizá el siguiente comando:
```bash
docker pull santiagosole93/adoption-api:1.0
```

### Capturas de Pantalla y Evidencias de Ejecución

#### 1. Construcción Exitosa de la Imagen (Docker Build)
<img width="1535" height="52" alt="Captura de pantalla 2026-06-22 213806" src="https://github.com/user-attachments/assets/1463f7fa-91d4-4356-8213-d4efbb1cb0d1" />

#### 2. Inicio Exitoso del Contenedor y Conexión a Base de Datos (Docker Run & Logs)
<img width="1102" height="142" alt="Captura de pantalla 2026-06-22 214253" src="https://github.com/user-attachments/assets/f0ee81e2-2a25-414c-8cb1-0858d7649ebb" />

