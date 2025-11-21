import Order from "../models/orderModel.js";
import generateInvoice from "../utils/invoiceGenerator.js";
import sendInvoiceEmail from "../utils/sendMail.js";

import fs from "fs";
import path from "path";

// ------------------------------------------------------------------
// 📌 CREATE ORDER
// ------------------------------------------------------------------
export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    // Create order
    const newOrder = await Order.create({
      user: req.userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "placed",
    });

    // Populate products for invoice
    await newOrder.populate("items.productId");

    // ----------------------------------------------------
    // 📁 ALWAYS create invoices folder:
    // /project/src/invoices/
    // ----------------------------------------------------
    const invoicesDir = path.join(process.cwd(), "src", "invoices");
    if (!fs.existsSync(invoicesDir)) {
      await fs.promises.mkdir(invoicesDir, { recursive: true });
      console.log("📁 Created invoices directory:", invoicesDir);
    }

    // Full path for saving invoice file
    const invoicePath = path.join(
      invoicesDir,
      `invoice_${newOrder._id}.pdf`
    );

    // ----------------------------------------------------
    // 🧾 Generate invoice (must finish before sending)
    // ----------------------------------------------------
    await generateInvoice(newOrder, invoicePath);

    // ----------------------------------------------------
    // 📧 Email invoice
    // ----------------------------------------------------
    if (req.userEmail) {
      try {
        await sendInvoiceEmail(req.userEmail, invoicePath);
      } catch (err) {
        console.log("❌ Failed to send invoice email:", err);
      }
    } else {
      console.log("⚠ No user email found — skipping email");
    }

    // ----------------------------------------------------
    // ✅ RESPONSE (very important)
    // ----------------------------------------------------
    return res.json({
      message: "Order created successfully",
      order: newOrder,
    });

  } catch (err) {
    console.error("❌ Order Create Error:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};

// ------------------------------------------------------------------
// 📌 GET ORDERS
// ------------------------------------------------------------------
export const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.userRole === "admin") {
      orders = await Order.find()
        .populate("items.productId")
        .populate("user", "name email");
    } else {
      orders = await Order.find({ user: req.userId }).populate(
        "items.productId"
      );
    }

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ------------------------------------------------------------------
// 📌 GET ORDER BY ID
// ------------------------------------------------------------------
export const getOrderById = async (req, res) => {
  try {
    let order;

    if (req.userRole === "admin") {
      order = await Order.findById(req.params.id).populate(
        "items.productId user",
        "-password"
      );
    } else {
      order = await Order.findOne({
        _id: req.params.id,
        user: req.userId,
      }).populate("items.productId");
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });

  } catch (err) {
    console.error("❌ Invalid Order ID:", err);
    res.status(400).json({ message: "Invalid order ID" });
  }
};

// ------------------------------------------------------------------
// 📌 ADMIN — GET ALL ORDERS
// ------------------------------------------------------------------
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("items.productId user");
  res.json(orders);
};
