import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const getProductsView = async (req, res) => {
  try {
    const products = await Product.find().lean();

    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }

    res.render("home", {
      products,
      cartId: cart._id.toString(),
      title: "Inicio"
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
};
