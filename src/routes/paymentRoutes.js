import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// HARD CODED FRONTEND URL
const FRONTEND_URL = "https://frontend-ten-pearl-rq99itri9.vercel.app";

router.post("/create-session", async (req, res) => {
    try {
        const { billType, amount, payee } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",

            success_url: `${FRONTEND_URL}/payment-success`,
            cancel_url: `${FRONTEND_URL}/payment-cancel`,

            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: billType },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],

            metadata: {
                billType,
                payee,
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe error:", error.message);
        res.status(500).json({ message: "Stripe session failed" });
    }
});

export default router;
