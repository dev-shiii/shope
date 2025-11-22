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

import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

/*
  🌍 FINAL WORKING CORS CONFIG
  Works with:
  ✔ Localhost frontend
  ✔ Render backend domain
  ✔ Vercel / Netlify Deployment
*/
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("API Running");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ⭐ Stripe Payment API
app.use("/api/payment", paymentRoutes);

// ⭐ Stripe Redirect Handler (success/cancel URLs)
app.use("/payment", paymentRedirect);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
