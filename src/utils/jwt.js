import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

export const success = (res, data, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const failure = (res, message, status = 400) => {
  res.status(status).json({ success: false, message });
};

export const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
