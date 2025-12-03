import ProductsDAO from "../dao/products.dao.js";

export default class ProductsRepository {
    constructor() {
        this.dao = new ProductsDAO();
    }

    async getAllProducts() {
        return await this.dao.getAll();
    }

    async getProductById(id) {
        return await this.dao.getById(id);
    }

    async createProduct(data) {
        return await this.dao.create(data);
    }

    async updateProduct(id, data) {
        return await this.dao.update(id, data);
    }

    async deleteProduct(id) {
        return await this.dao.delete(id);
    }
}