import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

export const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // <--- usar MONGO_URI
    ttl: 14 * 24 * 60 * 60 // duración de la sesión en segundos (opcional)
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
});
