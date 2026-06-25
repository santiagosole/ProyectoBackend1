import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Conexión exitosa a MongoDB.");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
  }
}
