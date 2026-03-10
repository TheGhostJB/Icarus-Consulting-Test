const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

const pool = new Pool({
  connectionString: process.env.MATCHES_DB_URL
});

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      service: "matches-service",
      status: "ok",
      db: "connected",
      time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      service: "matches-service",
      status: "error",
      db: "disconnected",
      error: error.message
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM match_view
      ORDER BY start_time
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM match_view WHERE match_id = 1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`matches-service listening on port ${PORT}`);
});