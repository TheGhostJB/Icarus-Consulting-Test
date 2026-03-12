import express, { Request, Response } from "express";
import { pool } from "./db";
import type { HealthCheckResult } from "./types";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4004;

app.get("/health", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<HealthCheckResult>("SELECT NOW() AS now");
    res.json({
      service: "analytics-service",
      status: "ok",
      db: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({
      service: "analytics-service",
      status: "error",
      db: "disconnected",
      error: err.message,
    });
  }
});

app.post("/event", (_req: Request, res: Response): void => {
  res.json({
    message: "analytics event endpoint working",
  });
});

app.listen(PORT, () => {
  console.log(`analytics-service listening on port ${PORT}`);
});
