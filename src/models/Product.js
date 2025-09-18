import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  code: String,
  stock: Number,
  category: String,
  thumbnails: [String],
  status: { type: Boolean, default: true }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
