import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/products.json');

export default class ProductManager {
  constructor() {
    this.path = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(productData) {
    const products = await this.getProducts();

    // Validación de CODE único
    if (products.some(p => p.code === productData.code)) {
      throw new Error('El código ya existe, debe ser único');
    }

    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...productData };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    updates.id = id;
    products[index] = { ...products[index], ...updates };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
