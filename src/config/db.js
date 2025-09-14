import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error("Error al conectar MongoDB:", err);
    process.exit(1);
  }
};
