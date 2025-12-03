import CartsDao from '../repositories/CartsDao.js';
import ProductsDao from '../repositories/ProductsDao.js';

class CartService {
  constructor() {
    this.cartDao = new CartsDao();
    this.productDao = new ProductsDao();
  }

  async getCart(cid) {
    return await this.cartDao.getById(cid);
  }

  async addProductToCart(cid, pid, user) {
    // Solo user puede agregar productos
    if (user.role !== 'user') {
      throw new Error('Solo los usuarios pueden agregar productos a su carrito');
    }

    const product = await this.productDao.getById(pid);
    if (!product) throw new Error('Producto no encontrado');

    return await this.cartDao.addProduct(cid, pid);
  }
}

export default CartService;