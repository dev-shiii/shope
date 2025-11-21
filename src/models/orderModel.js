import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
      price: Number
    }
  ],

  totalAmount: Number,
  paymentMethod: { type: String, default: "cod" },
  status: { type: String, default: "pending" },

  // <-- SHIPPING ADDRESS
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
