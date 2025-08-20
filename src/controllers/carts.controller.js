import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager("./src/data/carts.json");

export const getCartById = async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.json(cart);
  } catch (error) {
    res.status(500).send("Error al obtener carrito");
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
