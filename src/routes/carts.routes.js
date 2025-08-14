import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST /api/carts/
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cid);
    cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const updatedCart = await cartManager.addProductToCart(cid, pid);

    updatedCart
      ? res.json({ message: 'Producto agregado al carrito', cart: updatedCart })
      : res.status(404).json({ error: 'Carrito no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;
