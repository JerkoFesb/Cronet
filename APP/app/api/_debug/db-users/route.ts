import { db } from '@/db';
import { user } from '@/db/schema';

export async function GET() {
  try {
    const rows = await db.select().from(user);
    return new Response(JSON.stringify({ rows }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    console.error('[db-debug] error listing users', err);
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
