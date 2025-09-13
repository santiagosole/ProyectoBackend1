import Cart from "../models/Cart.js";

// Crear un carrito nuevo
export const createCart = async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
};

// Obtener carrito por ID (populate para traer productos completos)
export const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener carrito" });
  }
};

// Agregar producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const { pid } = req.params;
    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
};

// Agregar múltiples productos al carrito
export const addMultipleProductsToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Debe enviar un array de productos" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    products.forEach(({ productId, quantity }) => {
      const index = cart.products.findIndex(p => p.product.toString() === productId);
      if (index >= 0) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    });

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar múltiples productos" });
  }
};

// Actualizar TODO el carrito con un array de productos
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ productId, quantity }]

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products.map(p => ({
      product: p.productId,
      quantity: p.quantity
    }));

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar solo la cantidad de un producto
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ error: "Producto no encontrado" });

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar producto específico
export const deleteProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// Vaciar carrito
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
};
