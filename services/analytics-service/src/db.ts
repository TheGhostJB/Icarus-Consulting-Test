import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.ANALYTICS_DB_URL,
});

export { pool };
