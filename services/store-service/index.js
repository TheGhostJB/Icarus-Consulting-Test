require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4005

const pool = new Pool({
    connectionString: process.env.STORE_DB_URL
});

app.get("/", async (req, res) => {
    res.send('Hello from the store');
});

app.get("/health", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS now"
        );
        res.json({
            service: "store-service",
            status: "ok",
            db: "connected",
            time: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            service: "store-service",
            status: "error",
            db: "disconnected",
            error: error.message
        });
    }
});

app.post("/create_checkout", async (req, res) => {
  try {
    const { price_id, quantity } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
            price: price_id,
            quantity: quantity,
       }
    ],
      success_url: `${process.env.FRONTEND_URL}/paySuccess`,
      cancel_url: `${process.env.FRONTEND_URL}`,
    })

    // We send back the client_secret, not a URL
    res.status(200).json({ 
        "status": "success",
        "url": session.url 
    });

  } catch (e) {
    res.status(500).json({
        "status": "error", 
        error: e.message 
    });
  }
});

app.get("/get_products", async (req, res) => {
    try {
        const products = await stripe.products.list({
            limit: 5
        });

        res.status(200).json({
            "status": "success",
            products: products.data
        });

    } catch (e) {
        res.status(500).json({
            "status": "error",
            error: e.message
        })
    }
});

app.listen(PORT, () => {
  console.log(`store-service listening on port ${PORT}`);
});
