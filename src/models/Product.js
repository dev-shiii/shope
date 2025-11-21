import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, default: "general" }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
