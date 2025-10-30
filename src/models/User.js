// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // ✅ ahora es opcional
  role: { type: String, default: "user" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
