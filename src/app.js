import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ⭐ NEW — Stripe Payment Routes
import paymentRoutes from "./routes/paymentRoutes.js";
import paymentRedirect from "./routes/paymentRedirect.js";

// ⭐ NEW — Tracking Routes
import trackingRoutes from "./routes/trackingRoutes.js";

import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

/*
  🌎 CORS (Frontend + Backend)
*/
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

// Root status check
app.get("/", (req, res) => {
  res.send("API Running");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ⭐ Stripe Payment
app.use("/api/payment", paymentRoutes);
app.use("/payment", paymentRedirect);

// ⭐ Tracking Routes
app.use("/api/tracking", trackingRoutes);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
