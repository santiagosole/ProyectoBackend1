import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" } // "admin" o "user"
}, { timestamps: true });

export const UserModel = mongoose.model("User", userSchema);
