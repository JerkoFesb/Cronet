import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const emailCache = new Map<string, { exists: boolean; timestamp: number }>();
const CACHE_TTL = 30 * 1000;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "missing email" }, { status: 400 });
    }

    const cached = emailCache.get(email);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json(
        { exists: cached.exists },
        { 
          headers: { 
            'Cache-Control': 'private, max-age=30',
            'X-Cache': 'HIT'
          } 
        }
      );
    }

    const rows = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(sql`lower(${schema.user.email}) = ${email}`)
      .limit(1);

    const exists = rows.length > 0;
    
    emailCache.set(email, { exists, timestamp: Date.now() });
    
    if (emailCache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of emailCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          emailCache.delete(key);
        }
      }
    }

    return NextResponse.json(
      { exists },
      { 
        headers: { 
          'Cache-Control': 'private, max-age=30',
          'X-Cache': 'MISS'
        } 
      }
    );
  } catch (err: any) {
    console.error("/api/auth/check-email error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
