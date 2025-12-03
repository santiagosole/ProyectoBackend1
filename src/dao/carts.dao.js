import CartModel from "../models/Cart.js";

export default class CartsDAO {
    async getById(id) {
        return await CartModel.findById(id).populate("products.product");
    }

    async create() {
        return await CartModel.create({ products: [] });
    }

    async update(cartId, data) {
        return await CartModel.findByIdAndUpdate(cartId, data, { new: true });
    }
}