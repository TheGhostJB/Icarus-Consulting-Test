import { pool } from "./db";

async function migrate(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches_sync_log (
        id SERIAL PRIMARY KEY,
        source VARCHAR(100) NOT NULL,
        sync_date TIMESTAMP NOT NULL DEFAULT NOW(),
        status VARCHAR(50) NOT NULL
      );
    `);

    console.log("Migration completed");
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
