import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

/*
  🌍 FIXED — FINAL WORKING CORS CONFIG
  Supports:
  ✔ Localhost frontend
  ✔ Render backend self domain
  ✔ Deployed frontend (Vercel/netlify)
*/



app.use(cors({
  origin: "*",           // allow ALL frontends
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization",
}));

app.use(express.json());

// Root status check
app.get("/", (req, res) => {
  res.send("API Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
