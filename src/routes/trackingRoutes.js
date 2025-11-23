import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getOrderTracking, updateOrderTracking } from "../controllers/trackingController.js";

const router = express.Router();

// Get tracking (user or admin)
router.get("/:id", protect, getOrderTracking);

// Admin updates tracking
router.patch("/:id", protect, adminOnly, updateOrderTracking);

export default router;
