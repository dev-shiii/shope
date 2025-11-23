import Order from "../models/orderModel.js";

// protected: get tracking info for an order (user can view their own orders; admin can view any)
export const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select("tracking user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // allow admin or owner
    if (req.userRole !== "admin" && order.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order.tracking || { status: "unknown", currentLocation: null, history: [] });
  } catch (err) {
    console.error("Get tracking error:", err);
    res.status(500).json({ message: "Failed to load tracking" });
  }
};

// admin only: update tracking (set current location/status and push history)
export const updateOrderTracking = async (req, res) => {
  try {
    const { lat, lng, status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure tracking object exists
    if (!order.tracking) order.tracking = { history: [] };

    // Update current location + status
    if (lat !== undefined && lng !== undefined) {
      order.tracking.currentLocation = { lat: Number(lat), lng: Number(lng) };
    }
    if (status) {
      order.tracking.status = status;
    }

    // Push to history
    order.tracking.history = order.tracking.history || [];
    order.tracking.history.unshift({
      status: status || order.tracking.status,
      location: order.tracking.currentLocation || null,
      note: note || "",
      at: new Date()
    });

    await order.save();

    res.json({ message: "Tracking updated", tracking: order.tracking });
  } catch (err) {
    console.error("Update tracking error:", err);
    res.status(500).json({ message: "Failed to update tracking" });
  }
};
