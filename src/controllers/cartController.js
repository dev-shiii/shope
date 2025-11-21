import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate("items.productId");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const updated = await Cart.findOne({ userId: req.userId }).populate("items.productId");
    res.json(updated);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    const updated = await Cart.findOne({ userId: req.userId }).populate("items.productId");
    res.json(updated);
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// NEW: clear all items (used after successful order)
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      // still return success so front-end can clear local UI state
      return res.json({ items: [] });
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
