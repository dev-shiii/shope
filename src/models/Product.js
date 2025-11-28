import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, default: "general" },

    // ⭐ NEW: Location of the product (for distance & nearby product feature)
    location: {
      lat: { type: Number, required: false, default: 19.7515 }, // Default Maharashtra
      lng: { type: Number, required: false, default: 75.7139 },
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
