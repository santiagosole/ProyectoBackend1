import { Router } from "express";
import { 
  getCartView, 
  addProductToCart, 
  addMultipleProductsToCart, 
  removeProductFromCart 
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/:cid", getCartView);
router.post("/:cid/products", addProductToCart);
router.post("/:cid/products/bulk", addMultipleProductsToCart);
router.delete("/:cid/products/:pid", removeProductFromCart);

export default router;