import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "missing email" }, { status: 400 });
    }

    const rows = await db
      .select({ name: schema.user.name })
      .from(schema.user)
      .where(sql`lower(${schema.user.email}) = ${email}`)
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({ found: true, name: rows[0].name });
  } catch (err: any) {
    console.error("/api/auth/user-by-email error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
