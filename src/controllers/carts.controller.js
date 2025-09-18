import Cart from "../models/Cart.js";

export const getCartView = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const validProducts = cart.products.filter(item => item.product);
    const total = validProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    res.render("carts/cart", {
      products: validProducts,
      total,
      cartId: cart._id.toString(),
      title: "Carrito"
    });
  } catch (err) {
    res.status(500).send("Error al cargar carrito");
  }
};
