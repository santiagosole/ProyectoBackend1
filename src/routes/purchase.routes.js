import { Router } from "express";

const router = Router();

router.get("/summary", (req, res) => {
  // Esta ruta se renderizará desde cart.routes.js después de una compra exitosa
  // No hay lógica aquí, solo se usa para renderizar la vista
});

export default router;
