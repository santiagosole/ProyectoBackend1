import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const getProductsView = async (req, res) => {
  try {
    // Obtener o crear carrito "global" de prueba
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ products: [] });
      await cart.save();
    }

    const products = await Product.find().lean();
    res.render("home", { products, cartId: cart._id.toString(), title: "Inicio" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar productos");
  }
};
