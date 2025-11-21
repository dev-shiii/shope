import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN
router.post("/", protect, adminOnly, addProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
