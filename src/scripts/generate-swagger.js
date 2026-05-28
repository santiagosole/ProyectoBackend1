import fs from "fs";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de la API de Adopción",
      version: "1.0.0",
      description: "API para gestionar usuarios, productos y carritos en un ecommerce.",
    },
  },
  apis: ["./backend-preentrega/src/docs/**/*.yaml"],
};

const specs = swaggerJsdoc(swaggerOptions);
// Guardar en la raíz de la carpeta actual (proyecto-backend1)
const outputPath = path.resolve("..", "openapi-spec.json");
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), "utf-8");
console.log(`openapi-spec.json generado exitosamente en: ${outputPath}`);
