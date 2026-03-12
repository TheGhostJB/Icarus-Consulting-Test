import express, { Request, Response } from "express";
import { pool } from "./db";
import type { HealthCheckResult, MatchRow } from "./types";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

app.get("/health", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<HealthCheckResult>("SELECT NOW() AS now");
    res.json({
      service: "matches-service",
      status: "ok",
      db: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({
      service: "matches-service",
      status: "error",
      db: "disconnected",
      error: err.message,
    });
  }
});

app.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<MatchRow>(`
      SELECT *
      FROM match_view
      ORDER BY start_time
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const result = await pool.query<MatchRow>(
      "SELECT * FROM match_view WHERE match_id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Match not found",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`matches-service listening on port ${PORT}`);
});
