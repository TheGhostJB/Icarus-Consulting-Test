import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.ROOMS_DB_URL,
});

export { pool };
