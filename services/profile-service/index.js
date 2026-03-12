const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4003;

const pool = new Pool({
  connectionString: process.env.PROFILE_DB_URL
});

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      service: "profile-service",
      status: "ok",
      db: "connected",
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        account_id,
        user_id,
        first_name,
        last_name,
        username,
        country
      FROM accounts
      LIMIT 10
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM accounts
      WHERE user_id = $1
    `, [req.params.id]);

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`profile-service running on port ${PORT}`);
});