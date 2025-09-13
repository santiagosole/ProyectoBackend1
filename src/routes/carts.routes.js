import { Router } from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  addMultipleProductsToCart,
  updateCartProducts,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart
} from "../controllers/carts.controller.js";

const router = Router();

// Crear un carrito nuevo
router.post("/", createCart);

// Obtener carrito por ID
router.get("/:cid", getCartById);

// Agregar producto al carrito
router.post("/:cid/product/:pid", addProductToCart);

// Agregar varios productos al mismo tiempo
router.post("/:cid/products", addMultipleProductsToCart);

// Actualizar TODO el carrito con un arreglo de productos
router.put("/:cid", updateCartProducts);

// Actualizar solo la cantidad de un producto específico
router.put("/:cid/products/:pid", updateProductQuantity);

// Eliminar producto específico del carrito
router.delete("/:cid/product/:pid", deleteProductFromCart);

// Vaciar carrito
router.delete("/:cid", clearCart);

export default router;
