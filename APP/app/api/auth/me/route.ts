import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(req: Request) {
  try {
    if (typeof (handler as any).GET === "function") {
      return await (handler as any).GET(req);
    }

    return NextResponse.json(null);
  } catch (err: any) {
    console.error("/api/auth/me error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
