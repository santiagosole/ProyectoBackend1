import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// Ruta para crear un carrito nuevo
// POST /api/carts/
// No recibe nada por body, solo crea un carrito vacío y lo devuelve
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart); // 201 porque se creó un recurso nuevo
});

// Ruta para obtener los productos de un carrito específico
// GET /api/carts/:cid
// Retorna solo el array de productos dentro del carrito
router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cid);

  // Si existe el carrito, devuelvo los productos
  // Si no, envío error 404 que no se encontró
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Ruta para agregar un producto a un carrito
// POST /api/carts/:cid/product/:pid
// Agrega el producto indicado al carrito indicado (incrementa cantidad si ya está)
router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const updatedCart = await cartManager.addProductToCart(cid, pid);

  // Si pudo agregar el producto, retorno el carrito actualizado
  // Si no encontró el carrito, envío error 404
  updatedCart
    ? res.json({ message: 'Producto agregado al carrito', cart: updatedCart })
    : res.status(404).json({ error: 'Carrito no encontrado' });
});

export default router;
