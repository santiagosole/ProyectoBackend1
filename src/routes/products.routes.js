import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// GET /api/products/
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST /api/products/
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

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

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al agregar producto' });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const updated = await productManager.updateProduct(pid, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    await productManager.deleteProduct(pid);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
