import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";


export const protect = (req, res, next) => {
const authHeader = req.headers.authorization;


if (!authHeader || !authHeader.startsWith("Bearer ")) {
return res.status(401).json({ message: "No token provided" });
}


const token = authHeader.split(" ")[1];


try {
const decoded = jwt.verify(token, ENV.JWT_SECRET);


req.userId = decoded.id;
req.userRole = decoded.role;
req.userEmail = decoded.email; // ⭐ IMPORTANT


console.log("🔐 AUTH DECODED:", decoded);


next();
} catch (err) {
console.error("❌ Auth Error:", err.message);
return res.status(401).json({ message: "Invalid token" });
}
};