import Order from "../models/orderModel.js";

// ⭐ Helper: calculate linear movement between two coordinates
function interpolateLocation(start, end, progress) {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
}

// ⭐ GET TRACKING (auto updates delivery & location)
export const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check permission
    if (req.userRole !== "admin" && order.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const now = new Date();
    const created = new Date(order.createdAt);

    // Full 7-day delivery cycle
    const daysPassed = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(7 - daysPassed, 0);

    // Ensure delivery object exists
    if (!order.delivery) {
      order.delivery = {
        estimatedDays: 7,
        remainingDays: 7,
        lastUpdated: now,
      };
    }

    order.delivery.remainingDays = remaining;
    order.delivery.lastUpdated = now;

    // ⭐ Coordinates
    const warehouse = { lat: 28.6139, lng: 77.2090 }; // Delhi
    const destination = order.shippingAddress.coordinates;

    // =============================
    // ⭐ IF ORDER IS DELIVERED
    // =============================
    if (remaining === 0) {
      order.tracking.status = "delivered";
      order.tracking.currentLocation = destination;

      order.tracking.history.unshift({
        status: "delivered",
        location: destination,
        note: "Package delivered successfully",
        at: new Date(),
      });

      await order.save();

      return res.json({
        tracking: order.tracking,
        delivery: order.delivery,
      });
    }

    // =============================
    // ⭐ ORDER IN TRANSIT
    // =============================
    const progress = (7 - remaining) / 7; // 0 → 1
    const newLocation = interpolateLocation(warehouse, destination, progress);

    order.tracking.status = "in_transit";
    order.tracking.currentLocation = newLocation;

    order.tracking.history.unshift({
      status: "in_transit",
      location: newLocation,
      note: `Package is moving closer. ${remaining} days left.`,
      at: new Date(),
    });

    await order.save();

    return res.json({
      tracking: order.tracking,
      delivery: order.delivery,
    });
  } catch (err) {
    console.error("Tracking Error:", err);
    res.status(500).json({ message: "Failed to load tracking" });
  }
};

// ⭐ ADMIN CAN MANUALLY EDIT IF NEEDED
export const updateOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { lat, lng, status, note } = req.body;

    if (!order.tracking) order.tracking = { history: [] };

    // Update location manually
    if (lat && lng) {
      order.tracking.currentLocation = { lat: Number(lat), lng: Number(lng) };
    }

    if (status) order.tracking.status = status;

    order.tracking.history.unshift({
      status: status || order.tracking.status,
      location: order.tracking.currentLocation || null,
      note: note || "",
      at: new Date(),
    });

    await order.save();

    res.json({
      message: "Tracking updated",
      tracking: order.tracking,
    });
  } catch (err) {
    console.error("Update tracking error", err);
    res.status(500).json({ message: "Failed to update tracking" });
  }
};
