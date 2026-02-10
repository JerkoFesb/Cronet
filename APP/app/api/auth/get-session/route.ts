import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req: Request) {
  const startTime = Date.now();
  
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (session?.user) {
      return NextResponse.json({
        data: {
          user: {
            name: session.user.name,
            email: session.user.email,
            id: session.user.id
          }
        }
      }, {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=300',
          'X-Response-Time': `${responseTime}ms`,
        }
      });
    }
    
    return NextResponse.json({ data: null }, {
      headers: {
        'Cache-Control': 'private, no-cache',
        'X-Response-Time': `${responseTime}ms`,
      }
    });
  } catch (error) {
    console.error('[get-session] Error:', error);
    return NextResponse.json({ data: null }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  }
}
