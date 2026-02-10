import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  try {
    return await handler.POST(req);
  } catch (err: any) {
    if (err && typeof err.text === 'function') {
      try {
        const body = await err.text();
        return new Response(body, { 
          status: err.status || 500, 
          headers: { 'content-type': 'application/json' } 
        });
      } catch {
      }
    }

    const message = err?.message || 'Prijava nije uspjela.';
    return new Response(
      JSON.stringify({ error: message }), 
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
