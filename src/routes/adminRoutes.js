import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import User from "../models/User.js";
import Order from "../models/orderModel.js";

const router = express.Router();

// GET ALL USERS
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// GET ORDERS OF A SINGLE USER
router.get("/users/:id/orders", protect, adminOnly, async (req, res) => {
  const orders = await Order.find({ user: req.params.id })
    .populate("items.productId");
  res.json(orders);
});

export default router;
