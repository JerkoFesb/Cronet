import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  console.log('[auth handler proxy] sign-up/email POST');
  try {
    const res = await handler.POST(req);
    console.log('[auth handler proxy] proxied POST');
    return res;
  } catch (err: any) {
    console.error('[auth handler proxy] error', err);
    try {
      if (err && typeof (err as any).text === 'function') {
        const body = await (err as any).text();
        console.error('[auth handler proxy] thrown Response body:', body);
        return new Response(body, { status: (err as any).status || 500, headers: { 'content-type': 'application/json' } });
      }
    } catch (e) {
      console.error('[auth handler proxy] error reading thrown Response body', e);
    }

    // Return normalized JSON error for easier debugging in dev
    const message = err?.message || String(err);
    const stack = err?.stack || null;
    const payload = JSON.stringify({ error: message, stack }, null, 2);
    console.error('[auth handler proxy] normalized error payload:', payload);
    return new Response(payload, { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
