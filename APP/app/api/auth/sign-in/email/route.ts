import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  try {
    return await handler.POST(req);
  } catch (err: any) {
    // Handle thrown Response objects
    if (err && typeof err.text === 'function') {
      try {
        const body = await err.text();
        return new Response(body, { 
          status: err.status || 500, 
          headers: { 'content-type': 'application/json' } 
        });
      } catch {
        // Fall through to generic error
      }
    }

    const message = err?.message || 'Prijava nije uspjela.';
    return new Response(
      JSON.stringify({ error: message }), 
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
