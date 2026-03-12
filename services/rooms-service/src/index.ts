import express, { Request, Response } from "express";
import { pool } from "./db";
import type { HealthCheckResult } from "./types";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4003;

app.get("/health", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<HealthCheckResult>("SELECT NOW() AS now");
    res.json({
      service: "rooms-service",
      status: "ok",
      db: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({
      service: "rooms-service",
      status: "error",
      db: "disconnected",
      error: err.message,
    });
  }
});

app.post("/", (_req: Request, res: Response): void => {
  res.json({
    message: "create room endpoint working",
  });
});

app.get("/:id", (req: Request<{ id: string }>, res: Response): void => {
  res.json({
    message: `room ${req.params.id} endpoint working`,
  });
});

app.listen(PORT, () => {
  console.log(`rooms-service listening on port ${PORT}`);
});
