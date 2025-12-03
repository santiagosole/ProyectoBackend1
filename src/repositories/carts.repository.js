import CartsDAO from "../dao/carts.dao.js";

export default class CartsRepository {
    constructor() {
        this.dao = new CartsDAO();
    }

    async getCartById(id) {
        return await this.dao.getById(id);
    }

    async createCart() {
        return await this.dao.create();
    }

    async updateCart(id, data) {
        return await this.dao.update(id, data);
    }
}