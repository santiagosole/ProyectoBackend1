import ProductsDao from '../repositories/ProductsDao.js';

class ProductService {
  constructor() {
    this.productDao = new ProductsDao();
  }

  async getAllProducts() {
    return await this.productDao.getAll();
  }

  async getProductById(pid) {
    return await this.productDao.getById(pid);
  }

  async createProduct(productData, user) {
    // Lógica de negocio → solo admin puede crear
    if (user.role !== 'admin') {
      throw new Error('No autorizado. Solo admin puede crear productos.');
    }

    return await this.productDao.create(productData);
  }

  async updateProduct(pid, productData, user) {
    if (user.role !== 'admin') {
      throw new Error('No autorizado. Solo admin puede actualizar productos.');
    }

    return await this.productDao.update(pid, productData);
  }

  async deleteProduct(pid, user) {
    if (user.role !== 'admin') {
      throw new Error('No autorizado. Solo admin puede eliminar productos.');
    }

    return await this.productDao.delete(pid);
  }
}

export default ProductService;