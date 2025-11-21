import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  getAllOrders 
} from "../controllers/orderController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ⭐ ADMIN ROUTE FIRST — otherwise "/all" becomes ":id"
router.get("/all", protect, adminOnly, getAllOrders);

// USER ROUTES
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

export default router;
