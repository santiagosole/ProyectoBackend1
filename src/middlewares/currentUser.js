import jwt from "jsonwebtoken";

export function currentUser(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.locals.currentUser = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.locals.currentUser = {
      id: decoded.id,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      role: decoded.role
    };

  } catch (err) {
    res.locals.currentUser = null;
  }

  next();
}