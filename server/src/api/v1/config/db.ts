import dotenv from "dotenv";
dotenv.config();
import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

interface PoolConfig {
  connectionString: string;
  ssl: {
    rejectUnauthorized: boolean;
  };
  connectionTimeoutMillis: number;
  max: number;
  idleTimeoutMillis: number;
}

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL as string,
  ssl: {
    rejectUnauthorized: true,
  },
  connectionTimeoutMillis: 30000,
  max: 5,
  idleTimeoutMillis: 20000,
};

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("Connected to Neon PostgreSQL database");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected pool error:", err);
});

export async function executeQuery<T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.error(
      "Query error:",
      err instanceof Error ? err.message : String(err)
    );
    throw err;
  } finally {
    if (client) client.release();
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const result = await executeQuery("SELECT NOW()");
    console.log("Database connection test successful:", result.rows[0]);
    return true;
  } catch (err) {
    console.error(
      "Database connection test failed:",
      err instanceof Error ? err.message : String(err)
    );
    return false;
  }
}

export default pool;
