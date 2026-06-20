
import { Router } from "express";
import ProductsRepository from "../../repositories/products.repository.js";
import CartRepository from "../../repositories/carts.repository.js";
import { auth } from "../../middlewares/auth.js";
import ProductService from "../../services/product.service.js";

const router = Router();
const productsRepository = new ProductsRepository();
const cartRepository = new CartRepository();
const productService = new ProductService(); // Instancia del servicio de productos

// Vista de productos (protegida)
router.get("/", auth, async (req, res) => {
  try {
    // Obtener productos con un servicio, no directamente desde el repositorio
    const products = await productService.getAllProducts();
    let cartCount = 0;
    if (req.user && req.user.cart) {
      const cart = await cartRepository.getById(req.user.cart);
      if (cart) {
        cartCount = cart.products.reduce((acc, item) => acc + item.quantity, 0);
      }
    }
    res.render("products/products", { products, cartCount });
  } catch (error) {
    console.error("Error cargando productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;