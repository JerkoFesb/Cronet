// app/api/provideri/search/route.ts
import { db } from "@/db";
import { provideri } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql, and, gte, lte, eq, ilike, or, asc, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Ako ima ID parametar, dohvati samo taj provider
    const id = searchParams.get("id");
    if (id) {
      console.log('[Provideri API] Fetching by ID:', id);
      const result = await db.select().from(provideri).where(eq(provideri.id, id)).limit(1);
      console.log('[Provideri API] Found:', result.length);
      return NextResponse.json({
        success: true,
        count: result.length,
        results: result,
      });
    }
    
    // Parametri pretrage
    const city = searchParams.get("city")?.toLowerCase();
    const minSpeed = searchParams.get("minSpeed") ? parseInt(searchParams.get("minSpeed")!) : null;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;
    const accessType = searchParams.get("accessType")?.toUpperCase(); // FTTH, DOCSIS, DSL, 5G
    const provider = searchParams.get("provider");
    const sortBy = searchParams.get("sortBy") || "price"; // price, speed, gaming, streaming
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;

    console.log('[Provideri API] Search params:', {
      city,
      minSpeed,
      maxPrice,
      accessType,
      provider,
      sortBy,
      limit
    });

    // Kreiraj WHERE uslove
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

    // Query
    let query = db
      .select()
      .from(provideri)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit);

    // Sorting
    if (sortBy === "price") {
      query = query.orderBy(asc(provideri.priceEur));
    } else if (sortBy === "speed") {
      query = query.orderBy(desc(provideri.downloadMbps));
    } else if (sortBy === "gaming") {
      query = query.orderBy(desc(provideri.scoreGaming));
    } else if (sortBy === "streaming") {
      query = query.orderBy(desc(provideri.scoreStreaming));
    } else if (sortBy === "work") {
      query = query.orderBy(desc(provideri.scoreWork));
    } else if (sortBy === "family") {
      query = query.orderBy(desc(provideri.scoreFamily));
    }

    const results = await query;

    console.log(`[Provideri API] Found ${results.length} results`);

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
