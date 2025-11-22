import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  getAllOrders 
} from "../controllers/orderController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// ⭐ ADMIN ROUTE
router.get("/all", protect, adminOnly, getAllOrders);

// ⭐ DOWNLOAD INVOICE MUST COME BEFORE /:id
router.get("/:id/invoice", protect, async (req, res) => {
    const invoicePath = path.join(
        process.cwd(),
        "src",
        "invoices",
        `invoice_${req.params.id}.pdf`
    );

    if (!fs.existsSync(invoicePath)) {
        return res.status(404).json({ message: "Invoice not generated yet" });
    }

    return res.download(invoicePath, `invoice_${req.params.id}.pdf`);
});

// USER ROUTES
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);

// ⭐ MUST BE LAST
router.get("/:id", protect, getOrderById);

export default router;
