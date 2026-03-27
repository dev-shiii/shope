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
import Order from "../models/orderModel.js";
import generateInvoice from "../utils/invoiceGenerator.js";

const router = express.Router();

// ⭐ ADMIN ROUTE
router.get("/all", protect, adminOnly, getAllOrders);

// ⭐ DOWNLOAD INVOICE MUST COME BEFORE /:id
// ⭐ DOWNLOAD INVOICE (Generated on the fly!)
router.get("/:id/invoice", protect, async (req, res) => {
    try {
        // 1. Fetch the order details from the database
        const order = await Order.findById(req.params.id).populate("items.productId user");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Security check: Only the buyer or an admin can download it
        if (req.userRole !== "admin" && order.user._id.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to view this invoice" });
        }

        // 2. Define the path (We will still temporarily save it, but generate it fresh every time)
        const invoicesDir = path.join(process.cwd(), "src", "invoices");
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
        }
        const invoicePath = path.join(invoicesDir, `invoice_${req.params.id}.pdf`);

        // 3. Generate the PDF fresh right now
        await generateInvoice(order, invoicePath);

        // 4. Send it to the user
        res.download(invoicePath, `invoice_${req.params.id}.pdf`, (err) => {
            if (err) {
                console.error("Error sending file:", err);
            }
            // Optional but recommended: Delete the temp file immediately after sending to save space
            if (fs.existsSync(invoicePath)) {
                fs.unlinkSync(invoicePath);
            }
        });

    } catch (error) {
        console.error("Invoice Generation Error:", error);
        res.status(500).json({ message: "Failed to generate invoice document" });
    }
});

// USER ROUTES
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);

// ⭐ MUST BE LAST
router.get("/:id", protect, getOrderById);

export default router;
