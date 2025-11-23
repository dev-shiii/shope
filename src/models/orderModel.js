import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,
  paymentMethod: { type: String, default: "cod" },
  status: { type: String, default: "pending" },

  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },

  tracking: {
    status: { type: String, default: "created" },
    currentLocation: { lat: Number, lng: Number },

    history: [
      {
        status: String,
        location: { lat: Number, lng: Number },
        note: String,
        at: { type: Date, default: Date.now }
      }
    ]
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
