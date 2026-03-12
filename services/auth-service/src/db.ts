import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.AUTH_DB_URL,
});

export { pool };
