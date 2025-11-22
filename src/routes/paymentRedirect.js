import express from "express";
const router = express.Router();

// ⭐ Use the correct final Vercel domain
const FRONTEND_URL = "https://frontend-ten-pearl-rq99itri9.vercel.app";

router.get("/success", (req, res) => {
  return res.redirect(`${FRONTEND_URL}/payment-success`);
});

router.get("/cancel", (req, res) => {
  return res.redirect(`${FRONTEND_URL}/payment-cancel`);
});

export default router;
