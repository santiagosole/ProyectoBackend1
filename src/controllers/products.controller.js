import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// Controlador para la vista Home con filtros, orden y paginación
export const getProductsView = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;

    let query = {};
    if (req.query.query) {
      if (req.query.query === "available") query.stock = { $gt: 0 };
      else query.category = req.query.query;
    }

    const options = { page, limit, lean: true };  
    if (sort) options.sort = { price: sort };

    const result = await Product.paginate(query, options);

    // Tomar el primer carrito existente para el ejemplo (podés usar sesión de usuario en producción)
    let cart = await Cart.findOne().lean();
    if (!cart) {
      const newCart = await Cart.create({ products: [] });
      cart = newCart.toObject();
    }

    res.render("home", {
      products: result.docs,
      cartId: cart._id,
      pagination: {
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/?limit=${limit}&page=${result.prevPage}${req.query.sort ? `&sort=${req.query.sort}` : ""}${req.query.query ? `&query=${req.query.query}` : ""}` : null,
        nextLink: result.hasNextPage ? `/?limit=${limit}&page=${result.nextPage}${req.query.sort ? `&sort=${req.query.sort}` : ""}${req.query.query ? `&query=${req.query.query}` : ""}` : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar productos");
  }
};

// Controlador para la API JSON
export const getProductsAPI = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;

    let query = {};
    if (req.query.query) {
      if (req.query.query === "available") query.stock = { $gt: 0 };
      else query.category = req.query.query;
    }

    const options = { page, limit, lean: true };
    if (sort) options.sort = { price: sort };

    const result = await Product.paginate(query, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}${req.query.sort ? `&sort=${req.query.sort}` : ""}${req.query.query ? `&query=${req.query.query}` : ""}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}${req.query.sort ? `&sort=${req.query.sort}` : ""}${req.query.query ? `&query=${req.query.query}` : ""}` : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Crear varios productos al mismo tiempo (bulk)
export const createMultipleProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Debe enviar un array de productos" });
    }

    const createdProducts = await Product.insertMany(products);
    res.status(201).json(createdProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
