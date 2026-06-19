import ProductsRepository from '../repositories/products.repository.js';

export default class ProductService {
  constructor() {
    this.productRepository = new ProductsRepository();
  }

  async getAllProducts() {
    return await this.productRepository.getAll();
  }

  async getProductById(pid) {
    return await this.productRepository.getById(pid);
  }

  async createProduct(productData, user) {
    if (user.role !== 'admin') {
      throw new Error('No autorizado. Solo admin puede crear productos.');
    }
    return await this.productRepository.create(productData);
  }

  async updateProduct(pid, productData, user) {
    if (user.role !== 'admin') {
      throw new Error('No autorizado. Solo admin puede actualizar productos.');
    }
    return await this.productRepository.update(pid, productData);
  }

  async deleteProduct(pid, user) {
    if (user.role !== 'admin') {
      throw new Error('No autorizado. Solo admin puede eliminar productos.');
    }
    return await this.productRepository.delete(pid);
  }
}