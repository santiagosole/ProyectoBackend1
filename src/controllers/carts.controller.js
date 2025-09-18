import Cart from "../models/Cart.js";

export const getCartView = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const validProducts = cart.products.filter(i => i.product);
    const total = validProducts.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

    res.render("carts/cart", {
      products: validProducts,
      total,
      cartId: cart._id.toString(),
      title: "Carrito"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar carrito");
  }
};
