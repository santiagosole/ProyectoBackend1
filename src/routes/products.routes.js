import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener todos los productos
// GET /api/products/
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// Ruta para obtener un producto por id
// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await productManager.getProductById(pid);
  // Si encuentra el producto, lo devuelve, sino error 404
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

// Ruta para agregar un producto nuevo
// POST /api/products/
// Valida que los campos obligatorios estén presentes antes de agregar
router.post('/', async (req, res) => {
  const data = req.body;
  if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // status y thumbnails son opcionales, status por defecto true
  const newProduct = await productManager.addProduct({
    title: data.title,
    description: data.description,
    code: data.code,
    price: data.price,
    status: data.status ?? true,
    stock: data.stock,
    category: data.category,
    thumbnails: data.thumbnails ?? []
  });

  res.status(201).json(newProduct); // 201 porque se creó un recurso
});

// Ruta para actualizar un producto por id
// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const updated = await productManager.updateProduct(pid, req.body);

  // Devuelve el producto actualizado o error 404 si no existe
  updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
});

// Ruta para eliminar un producto por id
// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  await productManager.deleteProduct(pid);
  res.json({ message: 'Producto eliminado' });
});

export default router;
