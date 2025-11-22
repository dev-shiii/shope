import express from "express";
const router = express.Router();

router.get("/success", (req, res) => {
    return res.redirect("https://frontend-ten-pearl-rq99itri9.vercel.app/payment-success");
});

router.get("/cancel", (req, res) => {
    return res.redirect("https://frontend-ten-pearl-rq99itri9.vercel.app/payment-cancel");
});

export default router;
