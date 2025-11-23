import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ORDERED ITEMS
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: Number,
    paymentMethod: { type: String, default: "cod" },
    status: { type: String, default: "pending" },

    // SHIPPING ADDRESS (UPDATED WITH OPTIONAL COORDINATES)
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,

      // ⭐ For Google Maps tracking
      coordinates: {
        lat: { type: Number, default: 19.7515 }, // default: Maharashtra
        lng: { type: Number, default: 75.7139 },
      },
    },

    // ⭐⭐⭐ NEW DELIVERY SECTION ⭐⭐⭐
    delivery: {
      estimatedDays: { type: Number, default: 7 }, // total time
      remainingDays: { type: Number, default: 7 }, // countdown
      lastUpdated: { type: Date, default: Date.now },
    },

    // ⭐⭐⭐ TRACKING SECTION (updated) ⭐⭐⭐
    tracking: {
      status: {
        type: String,
        default: "created", // created → in_transit → out_for_delivery → delivered
      },

      currentLocation: {
        lat: { type: Number, default: 28.6139 }, // warehouse initial location
        lng: { type: Number, default: 77.2090 },
      },

      history: [
        {
          status: String,
          location: {
            lat: Number,
            lng: Number,
          },
          note: String,
          at: { type: Date, default: Date.now },
        },
      ],
    },
  },

  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
