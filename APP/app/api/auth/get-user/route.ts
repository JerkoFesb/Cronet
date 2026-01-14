import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(req: Request) {
  try {
    // If the auth handler exposes GET for fetching the current user/session, forward it
    if (typeof (handler as any).GET === "function") {
      return await (handler as any).GET(req);
    }

    // Fallback: return null to indicate no user
    return NextResponse.json(null);
  } catch (err: any) {
    console.error('/api/auth/get-user error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
