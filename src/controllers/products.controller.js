import Product from "../models/Product.js";

// Para la home
export const getHomeView = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("home", { products });
  } catch (error) {
    console.error(error);
    res.render("home", { products: [], error: "Error al cargar productos" });
  }
};

export const getProductsView = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products/products", { products });
  } catch (error) {
    console.error(error);
    res.render("products/products", { products: [], error: "Error al cargar productos" });
  }
};
