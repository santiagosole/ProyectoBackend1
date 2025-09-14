import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const getProductsView = async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const filter = {};
    if (query) {
      filter.$or = [
        { category: { $regex: query, $options: "i" } },
        { status: query.toLowerCase() === "true" }
      ];
    }

    const sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    else if (sort === "desc") sortOption.price = -1;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const productsWithQty = products.map(p => ({ product: p, quantity: 1 }));

    let cartId;
    const cart = await Cart.findOne();
    if (cart) cartId = cart._id;

    const pagination = {
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
      nextLink: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null
    };

    res.render("products/products", { products: productsWithQty, cartId, pagination });
  } catch (err) {
    res.status(500).send("Error al cargar productos: " + err.message);
  }
};

export const getProductsAPI = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMultipleProducts = async (req, res) => {
  try {
    const products = req.body; 
    const result = await Product.insertMany(products);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
