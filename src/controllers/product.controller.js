import ProductService from '../services/product.service.js';

const productService = new ProductService();

export default {
  getProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.pid);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const newProduct = await productService.createProduct(req.body, req.user);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.pid,
        req.body,
        req.user
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const result = await productService.deleteProduct(req.params.pid, req.user);
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
};