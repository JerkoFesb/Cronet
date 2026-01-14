import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  console.log('[auth handler proxy] sign-out POST');
  try {
    if (typeof (handler as any).POST === "function") {
      const res = await (handler as any).POST(req);
      return res;
    }

    // Fallback: try to clear session cookie if any and delete session rows (best-effort)
    try {
      const cookieHeader = req.headers.get('cookie') || '';
      if (cookieHeader) {
        const cookies = Object.fromEntries(cookieHeader.split(';').map((c) => {
          const [k, ...v] = c.split('=');
          return [k.trim(), decodeURIComponent((v || []).join('=').trim())];
        }));

        // Attempt to delete any session rows matching cookie values (token column)
        let deleted = 0;
        for (const key of Object.keys(cookies)) {
          const val = cookies[key];
          if (!val) continue;
          try {
            // delete where token = val
            await db.delete(schema.session).where(eq(schema.session.token, val));
            deleted++;
          } catch (e) {
            // ignore individual deletion errors
          }
        }

        const res = NextResponse.json({ ok: true, deleted });
        // Clear common possible cookie names so client-side won't present stale tokens
        const common = ['session', 'token', 'session_token', 'session-token', 'auth_token', 'next-auth.session-token'];
        for (const name of common) {
          try {
            res.cookies.set(name, '', { maxAge: 0, path: '/' });
          } catch (e) {
            // ignore
          }
        }

        return res;
      }
    } catch (e) {
      console.error('[auth handler proxy] sign-out fallback error', e);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[auth handler proxy] sign-out error', err);
    try {
      if (err && typeof (err as any).text === 'function') {
        const body = await (err as any).text();
        return new Response(body, { status: (err as any).status || 500, headers: { 'content-type': 'application/json' } });
      }
    } catch (e) {
      console.error('[auth handler proxy] error reading thrown Response body', e);
    }

    const message = err?.message || String(err);
    const stack = err?.stack || null;
    const payload = JSON.stringify({ error: message, stack }, null, 2);
    return new Response(payload, { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
