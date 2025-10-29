import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const getProductsView = async (req, res) => {
  try {
    // Obtener o crear carrito "global"
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ products: [] });
      await cart.save();
    }

    const products = await Product.find().lean();

    // Enviar datos del usuario logueado y carrito a la vista
    const user = req.session.user || null;

    res.render("products/list", {
      products,
      cartId: cart._id.toString(), // <--- importante para el form
      user,
      title: "Productos"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar productos");
  }
};
