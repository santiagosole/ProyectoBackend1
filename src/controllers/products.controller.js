import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const getProductsView = async (req, res) => {
  try {
    // Buscamos un carrito existente o creamos uno nuevo
    let cart = await Cart.findOne().lean(); // Aquí podés adaptarlo según usuario si hay login
    if (!cart) {
      const newCart = new Cart({ products: [] });
      cart = await newCart.save();
    }

    // Traemos los productos
    const products = await Product.find().lean();

    // Renderizamos home y pasamos products y cartId
    res.render("home", { products, cartId: cart._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar productos");
  }
};
