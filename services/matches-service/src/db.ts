import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.MATCHES_DB_URL,
  ssl: false,
});

export { pool };
