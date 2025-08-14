import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import { upload } from '../middlewares/upload.js';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

// Mostrar lista de productos con renderizado
router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render('products/list', { title: 'Productos', products });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Error al obtener productos' });
    }
});

// Mostrar formulario de nuevo producto
router.get('/new', (req, res) => {
    res.render('products/new', { title: 'Agregar Producto' });
});

// Crear producto con Multer y validaciones
router.post('/', upload.array('thumbnails', 5), async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).render('products/new', { title: 'Agregar Producto', error: 'Faltan campos obligatorios' });
        }

        const thumbnails = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        await manager.addProduct({ title, description, code, price, status: status ?? true, stock, category, thumbnails });
        res.redirect('/products');
    } catch (error) {
        res.status(500).render('products/new', { title: 'Agregar Producto', error: error.message || 'Error al agregar producto' });
    }
});

// Mostrar un producto específico (opcional con vista)
router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await manager.getProductById(pid);
        if (!product) return res.status(404).render('error', { title: 'No encontrado', message: 'Producto no encontrado' });
        res.render('products/detail', { title: product.title, product });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Error al obtener producto' });
    }
});

// PUT y DELETE se mantienen como API JSON
router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updated = await manager.updateProduct(pid, req.body);
        updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        await manager.deleteProduct(pid);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

export default router;
