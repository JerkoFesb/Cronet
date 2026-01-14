import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Configure postgres client for serverless/edge environments
// Use Supabase Transaction pooler (port 6543) to avoid connection limits
const client = postgres(process.env.DATABASE_URL!, {
  max: 10, // Increase connection pool for better performance
  idle_timeout: 20, // Close idle connections after 20 seconds
  max_lifetime: 60 * 30, // Close connections after 30 minutes
  connect_timeout: 3, // Reduce connection timeout to 3 seconds for faster failures
  prepare: false, // Disable prepared statements for better compatibility
});

export const db = drizzle({ client });
