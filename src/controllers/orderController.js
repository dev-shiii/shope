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

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // --- Create Order ---
    const newOrder = await Order.create({
      user: req.userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "placed",
    });

    // --- Initial Tracking (starting at warehouse) ---
    newOrder.tracking = {
      status: "created",
      currentLocation: { lat: 28.6139, lng: 77.2090 }, // Warehouse
      history: [
        {
          status: "created",
          location: { lat: 28.6139, lng: 77.2090 },
          note: "Order created",
          at: new Date(),
        },
      ],
    };

    // --- Delivery info ---
    newOrder.delivery = {
      estimatedDays: 7,
      remainingDays: 7,
      lastUpdated: new Date(),
    };

    await newOrder.save();

    // --- Generate Invoice ---
    await newOrder.populate("items.productId");

    const invoicesDir = path.join(process.cwd(), "src", "invoices");
    if (!fs.existsSync(invoicesDir)) {
      await fs.promises.mkdir(invoicesDir, { recursive: true });
    }

    const invoicePath = path.join(invoicesDir, `invoice_${newOrder._id}.pdf`);
    await generateInvoice(newOrder, invoicePath);

    // --- Email Invoice ---
    if (req.userEmail) {
      try {
        await sendInvoiceEmail(req.userEmail, invoicePath);
      } catch (err) {
        console.error("❌ Invoice email failed:", err);
      }
    }

    return res.json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};

// ------------------------------------------------------------------
// 📌 GET TRACKING + AUTO UPDATE DELIVERY/LOCATION
// ------------------------------------------------------------------
export const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.userRole !== "admin" && order.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ------------------------------------------------------------------
    // ⭐ ENSURE DELIVERY EXISTS
    // ------------------------------------------------------------------
    if (!order.delivery) {
      order.delivery = {
        estimatedDays: 7,
        remainingDays: 7,
        lastUpdated: new Date(),
      };
    }

    // ------------------------------------------------------------------
    // ⭐ ENSURE TRACKING EXISTS
    // ------------------------------------------------------------------
    if (!order.tracking || !order.tracking.currentLocation) {
      order.tracking = {
        status: "created",
        currentLocation: { lat: 28.6139, lng: 77.2090 },
        history: [
          {
            status: "created",
            location: { lat: 28.6139, lng: 77.2090 },
            note: "Order created",
            at: new Date(),
          },
        ],
      };
    }

    // ------------------------------------------------------------------
    // ⭐ DELIVERY COUNTDOWN LOGIC
    // ------------------------------------------------------------------
    const now = new Date();
    const created = new Date(order.createdAt);

    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(7 - diffDays, 0);

    order.delivery.remainingDays = remaining;
    order.delivery.lastUpdated = now;

    // ------------------------------------------------------------------
    // ⭐ TRACKING AUTO-MOVEMENT LOGIC
    // ------------------------------------------------------------------

    const warehouse = { lat: 28.6139, lng: 77.2090 };
    const destination = order.shippingAddress.coordinates;

    if (remaining === 0) {
      // Delivered
      order.tracking.status = "delivered";
      order.tracking.currentLocation = destination;
      order.tracking.history.unshift({
        status: "delivered",
        location: destination,
        note: "Package delivered",
        at: new Date(),
      });
    } else {
      // Move closer each day
      const progress = (7 - remaining) / 7;

      order.tracking.status = "in_transit";

      order.tracking.currentLocation = {
        lat: warehouse.lat + (destination.lat - warehouse.lat) * progress,
        lng: warehouse.lng + (destination.lng - warehouse.lng) * progress,
      };

      order.tracking.history.unshift({
        status: "in_transit",
        location: order.tracking.currentLocation,
        note: `Package is moving closer. ${remaining} days left.`,
        at: new Date(),
      });
    }

    // Save updates
    await order.save();

    return res.json({
      tracking: order.tracking,
      delivery: order.delivery,
    });
  } catch (err) {
    console.error("Tracking error:", err);
    return res.status(500).json({ message: "Failed to load tracking" });
  }
};

// ------------------------------------------------------------------
// 📌 GET ORDERS (User or Admin)
// ------------------------------------------------------------------
export const getOrders = async (req, res) => {
  try {
    const orders =
      req.userRole === "admin"
        ? await Order.find().populate("items.productId user")
        : await Order.find({ user: req.userId }).populate("items.productId");

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ------------------------------------------------------------------
// 📌 GET ORDER BY ID
// ------------------------------------------------------------------
export const getOrderById = async (req, res) => {
  try {
    const order =
      req.userRole === "admin"
        ? await Order.findById(req.params.id).populate("items.productId user")
        : await Order.findOne({
            _id: req.params.id,
            user: req.userId,
          }).populate("items.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ order });
  } catch (err) {
    console.error("Order fetch error:", err);
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
