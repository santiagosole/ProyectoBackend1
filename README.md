# Proyecto Backend Coderhouse

Este es un proyecto de backend desarrollado para el curso de Coderhouse.

## Estructura del Proyecto

```
backend-preentrega/
├── coverage/ # Informes de cobertura de tests
├── docker/ # Archivos relacionados con Docker (e.g., configuraciones Nginx, scripts de entrada)
├── public/ # Archivos estáticos (CSS, imágenes, etc.)
├── src/ # Código fuente de la aplicación
│   ├── config/ # Configuraciones de la aplicación (base de datos, passport, etc.)
│   ├── controllers/ # Lógica de negocio y manejo de peticiones HTTP
│   ├── dao/ # Objetos de Acceso a Datos (interacción con la base de datos)
│   ├── docs/ # Documentación de la API (Swagger/OpenAPI)
│   ├── dto/ # Objetos de Transferencia de Datos
│   ├── middlewares/ # Funciones middleware para Express
│   ├── models/ # Definición de modelos de datos (Mongoose)
│   ├── repositories/ # Capa de abstracción para DAOs
│   ├── routes/ # Definición de rutas de la API y vistas
│   ├── scripts/ # Scripts utilitarios (generación Swagger, instrumentación)
│   ├── services/ # Lógica de negocio (manejo de datos, envío de correos, etc.)
│   ├── views/ # Archivos de vistas (Handlebars)
│   ├── app.js # Punto de entrada principal de la aplicación
│   ├── auth.js # Lógica de autenticación
│   ├── processData.js # Ejemplo de procesamiento de datos
│   └── server.js # Configuración del servidor
├── tests/ # Tests unitarios e de integración
├── .dockerignore # Archivos a ignorar por Docker
├── .env # Variables de entorno
├── .gitignore # Archivos a ignorar por Git
├── BUILD_LOGS.txt # Logs de construcción de la imagen Docker
├── Dockerfile # Definición de la imagen Docker
├── package.json # Definición del proyecto y dependencias
└── README.md # Documentación del proyecto
```

## Arquitectura y Propósito de las Carpetas Principales

-   **`src/`**: Contiene todo el código fuente de la aplicación. Está organizado en subcarpetas para separar las distintas responsabilidades (configuración, controladores, DAOs, modelos, etc.), siguiendo un patrón MVC/Repositorio para una mejor modularidad y mantenimiento.
-   **`src/config/`**: Almacena configuraciones cruciales como la conexión a la base de datos y la estrategia de autenticación (Passport.js).
-   **`src/controllers/`**: Contiene la lógica principal que maneja las solicitudes HTTP, interactuando con los servicios para procesar la lógica de negocio y enviar respuestas.
-   **`src/dao/`**: Implementa la capa de acceso a datos, encargada de la interacción directa con la base de datos, separando esta lógica del resto de la aplicación.
-   **`src/models/`**: Define los esquemas de la base de datos utilizando Mongoose, representando la estructura de los datos.
-   **`src/routes/`**: Aquí se definen las rutas de la API y las rutas para renderizar las vistas, organizando los endpoints de la aplicación.
-   **`src/services/`**: Contiene la lógica de negocio central, orquestando las operaciones y utilizando los DAOs para acceder a los datos. Esto permite una separación clara de las preocupaciones y facilita la reutilización del código.
-   **`public/`**: Almacena recursos estáticos como hojas de estilo CSS, archivos JavaScript del lado del cliente e imágenes que son servidos directamente por el servidor.
-   **`tests/`**: Contiene todos los archivos de pruebas, asegurando la calidad y el correcto funcionamiento de la aplicación.
-   **`docker/`**: Incluye archivos de configuración para Docker, como scripts de entrada o configuraciones específicas para el entorno de contenedor, por ejemplo, Nginx.

## Despliegue con Docker

### 1. Construir la imagen Docker

Para construir la imagen Docker del proyecto, asegúrate de estar en la raíz del directorio `backend-preentrega` y ejecuta el siguiente comando:

```bash
docker build -t <nombre_de_tu_imagen> .
```

Reemplaza `<nombre_de_tu_imagen>` con el nombre que desees darle a tu imagen (por ejemplo, `backend-coderhouse`).

### 2. Ejecutar el contenedor Docker

Para ejecutar el contenedor, puedes pasar variables de entorno necesarias. Por ejemplo, si tu aplicación requiere una URL de conexión a MongoDB, puedes hacerlo de la siguiente manera:

```bash
docker run -p 8080:8080 -d --name <nombre_de_tu_contenedor> -e MONGODB_URI="mongodb://localhost:27017/mydatabase" <nombre_de_tu_imagen>
```

Reemplaza:
-   `<nombre_de_tu_contenedor>`: Nombre para tu instancia de contenedor (ej. `backend-app`).
-   `MONGODB_URI`: Variable de entorno para la conexión a la base de datos. Ajusta la URL según tu configuración.
-   `<nombre_de_tu_imagen>`: El nombre que le diste a la imagen en el paso anterior.
- `8080:8080`: Mapea el puerto 8080 del host al puerto 8080 del contenedor. Ajusta si tu aplicación usa un puerto diferente.

**Logs del Contenedor:**

[PEGAR CAPTURA DE PANTALLA DE LOS LOGS AQUÍ]

### 3. Subir imagen a DockerHub (Opcional)

Para subir tu imagen a DockerHub, primero debes autenticarte:

```bash
docker login
```

Luego, etiqueta tu imagen con tu usuario de DockerHub y súbela:

```bash
docker tag <nombre_de_tu_imagen> <tu_usuario_dockerhub>/<nombre_de_tu_imagen>:latest
docker push <tu_usuario_dockerhub>/<nombre_de_tu_imagen>:latest
```

URL de DockerHub: [PEGAR URL DE DOCKERHUB AQUÍ]

## Ejecutar Tests

Para correr la suite de tests, asegúrate de tener las dependencias instaladas (`npm install`). Luego, ejecuta el siguiente comando en la raíz del directorio `backend-preentrega`:

```bash
npm test
```

Esto ejecutará todos los tests definidos en la carpeta `tests/` y generará un informe de resultados.

**Logs de los Tests:**

[PEGAR CAPTURA DE PANTALLA DE LOS LOGS DE LOS TESTS AQUÍ]
