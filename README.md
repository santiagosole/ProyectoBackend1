# Documentación del Proyecto: backend-preentrega

## 1. Árbol de Directorios
```
backend-preentrega/
├── Dockerfile
├── .dockerignore
├── .env
├── .env.local
├── .env.*.local
├── entrada.txt
├── entrada-instrument.txt
├── package.json
├── package-lock.json
├── README.md
├── src/
│   ├── app.js
│   ├── auth.js
│   ├── config/
│   │   ├── db.js
│   │   └── passport.config.js
│   ├── controllers/
│   │   ├── cart.controller.js
│   │   ├── product.controller.js
│   │   ├── user.controller.js
│   │   └── reset.routes.js
│   ├── dao/
│   │   ├── carts.dao.js
│   │   ├── products.dao.js
│   │   └── users.dao.js
│   ├── dto/
│   │   └── user.dto.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Product.js
│   │   └── User.model.js
│   ├── middlewares/
│   │   ├── authorization.js
│   │   ├── auth.js
│   │   ├── currentUser.js
│   │   └── passport.config.js
│   ├── routes/
│   │   ├── adoption.router.js
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── purchase.routes.js
│   │   ├── products.routes.js
│   │   └── sessions.routes.js
│   ├── services/
│   │   ├── mailing.service.js
│   │   └── purchase.service.js
│   ├── scripts/
│   │   ├── config-level-cli.js
│   │   ├── generate-swagger.js
│   │   ├── instrument-requests-cli.js
│   │   └── log-metrics-cli.js
│   ├── views/
│   │   ├── auth/
│   │   │   ├── login.handlebars
│   │   │   ├── register.handlebars
│   │   │   └── registerSuccess.handlebars
│   │   ├── cart/
│   │   │   └── cart.handlebars
│   │   ├── purchase/
│   │   │   └── summary.handlebars
│   │   ├── products/
│   │   │   └── products.handlebars
│   │   ├── reset/
│   │   │   ├── requestReset.handlebars
│   │   │   └── resetPassword.handlebars
│   │   └── users/
│   │       └── current.handlebars
│   └── views/
│       └── layouts/
│           └── main.handlebars
├── tests/
│   └── adoption.test.js
├── public/
│   └── css/
│       └── style.css
└── uploads/
```

## 2. Arquitectura del Proyecto
### Componentes Principales
- **Modelos**: Definiciones de datos (User, Product, Cart) usando Mongoose.
- **Controladores**: Lógica de negocio para endpoints (product.controller.js, user.controller.js).
- **Servicios**: Lógica de negocio encapsulada (product.service.js, purchase.service.js).
- **Repositorios**: Acceso a datos (products.repository.js, carts.repository.js).
- **Rutas**: Definición de endpoints (adoption.router.js, auth.routes.js).
- **Middlewares**: Autenticación y autorización (auth.js, authorization.js).
- **Vistas**: Plantillas Handlebars para interfaces (products/products.handlebars).

### Flujo de Trabajo
1. **Autenticación**: Usuarios se autentican mediante JWT o OAuth2.
2. **Gestión de Carrito**: Usuarios pueden agregar/eliminar productos al carrito.
3. **Procesamiento de Adopciones**: Lógica para crear y gestionar adopciones.
4. **Integración con Docker**: Contenedor para despliegue en producción.

## 3. Instrucciones de Docker
### Construcción
```bash
docker build -t backend-preentrega .
```

### Ejecución
```bash
docker run -p 8080:8080 -e MONGO_URI="mongodb://localhost:27017/preentrega" -e JWT_SECRET="your_secret_key" backend-preentrega
```

### Variables de Entorno
- `MONGO_URI`: URI de conexión a MongoDB.
- `JWT_SECRET`: Clave secreta para JWT.

## 4. Pruebas
### Ejecutar Pruebas
```bash
npm test
```

### Cobertura
```bash
npm test -- --coverage
```

## 5. Placeholders
- **URL de DockerHub**: `https://hub.docker.com/r/usuario/repo`
- **Capturas de Logs**: `BUILD_LOGS.txt`, `FIRE_TEST_REPORT.md`

## 6. Instrucciones de Ejecución
1. **Iniciar el servidor**:
   ```bash
   npm start
   ```
2. **Ejecutar pruebas**:
   ```bash
   npm test
   ```
3. **Ejecutar Docker**:
   ```bash
   docker build -t backend-preentrega .
   docker run -p 8080:8080 backend-preentrega
   ```

## 7. Notas Adicionales
- **Dependencias**: Requiere Node.js v18+ y MongoDB.
- **Configuración**: Variables de entorno en `.env` o `.env.local`.
- **Documentación**: Swagger generada con `npm run config:level`.