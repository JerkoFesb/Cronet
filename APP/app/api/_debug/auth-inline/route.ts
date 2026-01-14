import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  console.log('[auth-debug] calling auth.api.signUpEmail with', body);
  try {
    // @ts-ignore - runtime method on auth
    const res = await (auth as any).api.signUpEmail({ body });
    console.log('[auth-debug] success', res);
    return new Response(JSON.stringify({ success: true, res }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    console.error('[auth-debug] error', err);
    return new Response(JSON.stringify({ success: false, error: err?.message || String(err), stack: err?.stack || null }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
