import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // Remove password before sending
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // ✅ FIXED

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
   const token = jwt.sign(
  { id: user._id, role: user.role, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "30d" }
);


    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ME
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
