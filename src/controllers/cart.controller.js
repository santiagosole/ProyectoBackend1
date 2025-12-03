import CartService from '../services/cart.service.js';

const cartService = new CartService();

export default {
  getCart: async (req, res) => {
    try {
      const cart = await cartService.getCart(req.params.cid);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  addProduct: async (req, res) => {
    try {
      const result = await cartService.addProductToCart(
        req.params.cid,
        req.params.pid,
        req.user
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
};