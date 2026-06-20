import CartModel from "../models/Cart.js";

export default class CartsDAO {
    async getById(id) {
        return await CartModel.findById(id).populate("products.productId");
    }

    async create() {
        return await CartModel.create({ products: [] });
    }

    async update(cartId, data) {
        return await CartModel.findByIdAndUpdate(cartId, data, { new: true });
    }

    async addProduct(cartId, productId) {
        return await CartModel.findByIdAndUpdate(
            cartId,
            { $push: { products: { product: productId } } },
            { new: true }
        );
    }
}