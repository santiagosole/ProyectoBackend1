import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGO_URL;
const secret = process.env.SESSION_SECRET || "coderSecret";

export const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl,
    ttl: 60 * 60, // 1 hora en segundos
  }),
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 hora en ms
  }
});
