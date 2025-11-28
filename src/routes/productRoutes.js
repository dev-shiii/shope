import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  getNearbyProducts
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

/* ---------------------------------
   ⭐ VERY IMPORTANT!
   Nearby route MUST come first.
---------------------------------- */
router.get("/nearby", getNearbyProducts);

/* ---------------------------------
   ⭐ PUBLIC ROUTES
---------------------------------- */
router.get("/", getProducts);

/* 
  ⭐ ID ROUTE MUST BE LAST
  Because "/:id" will catch ANYTHING
  unless other routes are above it.
*/
router.get("/:id", getProductById);

/* ---------------------------------
   ⭐ ADMIN ROUTES
---------------------------------- */
router.post("/", protect, adminOnly, addProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
