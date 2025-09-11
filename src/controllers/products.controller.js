import Product from "../models/Product.js";

// Controlador para la vista de productos con paginación
export const getProductsView = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
    const query = req.query.query ? { category: req.query.query } : {};

    const options = {
      page,
      limit,
      lean: true
    };
    if (sort) options.sort = { price: sort };

    const result = await Product.paginate(query, options);

    res.render("products/products", {
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}` : null
      }
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
};

// Controlador para API
export const getProductsAPI = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
    const query = req.query.query ? { category: req.query.query } : {};

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
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getHomeView = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
    const query = req.query.query ? { category: req.query.query } : {};

    const options = { page, limit, lean: true };
    if (sort) options.sort = { price: sort };

    const result = await Product.paginate(query, options);

    res.render("home", {
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/?limit=${limit}&page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/?limit=${limit}&page=${result.nextPage}` : null
      }
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos en home");
  }
};
