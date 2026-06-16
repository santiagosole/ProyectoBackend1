import CartsDAO from "../dao/carts.dao.js";

export default class CartsRepository {
    constructor() {
        this.dao = new CartsDAO();
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async create() {
        return await this.dao.create();
    }

    async update(id, data) {
        return await this.dao.update(id, data);
    }

    async addProduct(cartId, productId) {
        return await this.dao.addProduct(cartId, productId);
    }
}