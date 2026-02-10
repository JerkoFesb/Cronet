import { db } from "@/db";
import { provideri } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql, and, gte, lte, eq, ilike, or, asc, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const id = searchParams.get("id");
    if (id) {
      const result = await db.select().from(provideri).where(eq(provideri.id, id)).limit(1);
      return NextResponse.json({
        success: true,
        count: result.length,
        results: result,
      });
    }
    
    const city = searchParams.get("city")?.toLowerCase();
    const minSpeed = searchParams.get("minSpeed") ? parseInt(searchParams.get("minSpeed")!) : null;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;
    const accessType = searchParams.get("accessType")?.toUpperCase();
    const provider = searchParams.get("provider");
    const sortBy = searchParams.get("sortBy") || "price";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;

    const conditions = [];

    if (city) {
      conditions.push(
        or(
          ilike(provideri.city, `%${city}%`),
          ilike(provideri.region, `%${city}%`)
        )
      );
    }

    if (minSpeed) {
      conditions.push(gte(provideri.downloadMbps, minSpeed));
    }

    if (maxPrice) {
      conditions.push(lte(provideri.priceEur, maxPrice));
    }

    if (accessType) {
      conditions.push(eq(provideri.accessType, accessType));
    }

    if (provider) {
      conditions.push(ilike(provideri.providerName, `%${provider}%`));
    }

    let orderByClause;
    if (sortBy === "price") {
      orderByClause = asc(provideri.priceEur);
    } else if (sortBy === "speed") {
      orderByClause = desc(provideri.downloadMbps);
    } else if (sortBy === "gaming") {
      orderByClause = desc(provideri.scoreGaming);
    } else if (sortBy === "streaming") {
      orderByClause = desc(provideri.scoreStreaming);
    } else if (sortBy === "work") {
      orderByClause = desc(provideri.scoreWork);
    } else if (sortBy === "family") {
      orderByClause = desc(provideri.scoreFamily);
    } else {
      orderByClause = asc(provideri.priceEur);
    }

    const results = await db
      .select()
      .from(provideri)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: results.length,
      results: results,
    });

  } catch (error: any) {
    console.error('[Provideri API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search providers' },
      { status: 500 }
    );
  }
}
