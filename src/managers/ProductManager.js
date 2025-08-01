import { promises as fs } from 'fs';
import path from 'path';

// Ruta donde se guarda el archivo JSON con los productos
const filePath = path.resolve('src/data/products.json');

export default class ProductManager {
  constructor() {
    // Guardo la ruta del archivo para usarla luego
    this.path = filePath;
  }

  // Lee y devuelve todos los productos guardados en el archivo JSON
  // Si no existe o hay error, devuelve un array vacío
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Busca un producto por su ID y lo devuelve (o undefined si no existe)
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  // Agrega un nuevo producto con un ID autogenerado y los datos que vienen
  async addProduct(productData) {
    const products = await this.getProducts();

    // Defino el nuevo ID como el último +1 o 1 si no hay productos
    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...productData };

    // Lo agrego al array y guardo en el archivo JSON
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  // Actualiza un producto buscando por ID, si no existe devuelve null
  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Aseguro que el id no se modifique
    updates.id = id;
    // Actualizo solo los campos que vinieron en updates
    products[index] = { ...products[index], ...updates };

    // Guardo los cambios en el archivo
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  // Elimina un producto por ID filtrando el array y guardando
  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
