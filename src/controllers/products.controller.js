import ProductManager from "../managers/ProductManager.js";
const productManager = new ProductManager();

// Vista de productos para Handlebars
export const getProductsView = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("products/products", { products });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
};
