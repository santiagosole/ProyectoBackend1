import CartsRepository from '../repositories/carts.repository.js';
import ProductsRepository from '../repositories/products.repository.js';

class CartService {
  constructor() {
    this.cartRepository = new CartsRepository();
    this.productRepository = new ProductsRepository();
  }

  async getCart(cid) {
    return await this.cartRepository.getById(cid);
  }

  async addProductToCart(cid, pid, user) {
    if (user.role !== 'user') {
      throw new Error('Solo los usuarios pueden agregar productos a su carrito');
    }

    const product = await this.productRepository.getById(pid);
    if (!product) throw new Error('Producto no encontrado');

    return await this.cartRepository.addProduct(cid, pid);
  }
}