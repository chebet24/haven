const express = require("express");
const router = express.Router();
























const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "Ksh",
      metadata: {
        company: "Haventure",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
;


router.get(
  "/key",
  async (req, res, next) => {
    console.log("Reached /key endpoint");
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  }
);
router.get("/test", (req, res) => {
  console.log("Reached /test endpoint");
  res.send("Hello from /test");
});



module.exports = router;