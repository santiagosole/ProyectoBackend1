import ProductsDAO from "../dao/products.dao.js";

export default class ProductsRepository {
    constructor() {
        this.dao = new ProductsDAO();
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async create(data) {
        return await this.dao.create(data);
    }

    async update(id, data) {
        return await this.dao.update(id, data);
    }

    async delete(id) {
        return await this.dao.delete(id);
    }
}