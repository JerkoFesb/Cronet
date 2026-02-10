import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  try {
    const res = await handler.POST(req);
    return res;
  } catch (err: any) {
    console.error('[sign-up] error', err);
    try {
      if (err && typeof (err as any).text === 'function') {
        const body = await (err as any).text();
        return new Response(body, { status: (err as any).status || 500, headers: { 'content-type': 'application/json' } });
      }
    } catch (e) {
    }

    const message = err?.message || String(err);
    const stack = err?.stack || null;
    const payload = JSON.stringify({ error: message, stack }, null, 2);
    return new Response(payload, { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
