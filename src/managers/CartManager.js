import { promises as fs } from 'fs';
import path from 'path';

// Defino la ruta donde se guardan los carritos en un archivo JSON
const filePath = path.resolve('src/data/carts.json');

export default class CartManager {
  constructor() {
    // Guardo la ruta en una propiedad para usarla después
    this.path = filePath;
  }

  // Lee y devuelve todos los carritos guardados en el archivo
  // Si el archivo no existe o hay error, devuelve un array vacío
  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Busca y devuelve un carrito por su ID
  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === id);
  }

  // Crea un carrito nuevo con un ID único y un array vacío de productos
  async createCart() {
    const carts = await this.getCarts();
    // El nuevo ID es el último + 1, o 1 si no hay carritos
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;

    const newCart = {
      id: newId,
      products: []
    };

    // Agrego el carrito nuevo al listado y guardo en el archivo
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // Agrega un producto a un carrito específico
  // Si el producto ya está, incrementa la cantidad
  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    // Busco el índice del carrito para modificarlo
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) return null; // Carrito no encontrado

    const cart = carts[cartIndex];
    // Busco si el producto ya está dentro del carrito
    const productInCart = cart.products.find(p => p.product === productId);

    if (productInCart) {
      // Si ya está, sumo uno a la cantidad
      productInCart.quantity += 1;
    } else {
      // Si no está, lo agrego con cantidad 1
      cart.products.push({ product: productId, quantity: 1 });
    }

    // Guardo el carrito actualizado en el archivo JSON
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
