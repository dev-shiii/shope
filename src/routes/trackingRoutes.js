import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getOrderTracking, updateOrderTracking } from "../controllers/trackingController.js";

const router = express.Router();

/**
 * USER or ADMIN → Get tracking + delivery countdown
 * GET /api/tracking/:id
 */
router.get("/:id", protect, getOrderTracking);

/**
 * ADMIN ONLY → manually update location/status if needed
 * PATCH /api/tracking/:id
 */
router.patch("/:id", protect, adminOnly, updateOrderTracking);

export default router;
