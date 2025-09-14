import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET /carts/:cid → Vista Handlebars
export const getCartView = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    // Filtrar productos válidos (puede que alguno se haya eliminado)
    const validProducts = cart.products.filter(item => item.product);

    // Calcular total
    const total = validProducts.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.render("carts/cart", {
      products: validProducts,
      cartId: cart._id,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar carrito");
  }
};

// POST /carts/:cid/products → agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /carts/:cid/products/bulk → agregar varios productos al carrito
export const addMultipleProductsToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // array [{ product: "id", quantity: 2 }, ...]

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    products.forEach(({ product, quantity }) => {
      const existing = cart.products.find(p => p.product.toString() === product);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.products.push({ product, quantity });
      }
    });

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /carts/:cid/products/:pid → eliminar producto del carrito
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
