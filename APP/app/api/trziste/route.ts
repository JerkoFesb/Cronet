import { db } from "@/db";
import { provideri } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, sql, asc, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const providerName = slug.replace(/-/g, " ");

      const packages = await db
        .select()
        .from(provideri)
        .where(sql`LOWER(${provideri.providerName}) = LOWER(${providerName})`)
        .orderBy(asc(provideri.priceEur));

      if (packages.length === 0) {
        return NextResponse.json(
          { error: "Provider nije pronađen" },
          { status: 404 }
        );
      }

      const name = packages[0].providerName;
      const cities = [...new Set(packages.map((p) => p.city))].sort();
      const accessTypes = [...new Set(packages.map((p) => p.accessType))].sort();
      const priceRange = {
        min: Math.min(...packages.map((p) => p.priceEur)),
        max: Math.max(...packages.map((p) => p.priceEur)),
      };
      const speedRange = {
        min: Math.min(...packages.map((p) => p.downloadMbps)),
        max: Math.max(...packages.map((p) => p.downloadMbps)),
      };
      const avgScores = {
        gaming: Math.round(
          packages.reduce((s, p) => s + p.scoreGaming, 0) / packages.length
        ),
        streaming: Math.round(
          packages.reduce((s, p) => s + p.scoreStreaming, 0) / packages.length
        ),
        work: Math.round(
          packages.reduce((s, p) => s + p.scoreWork, 0) / packages.length
        ),
        family: Math.round(
          packages.reduce((s, p) => s + p.scoreFamily, 0) / packages.length
        ),
      };
      const hasIPv6 = packages.some((p) => p.ipv6Support);
      const hasCGNAT = packages.some((p) => p.cgnat);
      const hasPromotion = packages.some((p) => p.promotionActive);
      const websiteUrl = packages[0].websiteUrl;

      return NextResponse.json({
        success: true,
        provider: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          cities,
          accessTypes,
          priceRange,
          speedRange,
          avgScores,
          hasIPv6,
          hasCGNAT,
          hasPromotion,
          websiteUrl,
          packageCount: packages.length,
          packages: packages.map((p) => ({
            id: p.id,
            packageName: p.packageName,
            city: p.city,
            accessType: p.accessType,
            downloadMbps: p.downloadMbps,
            uploadMbps: p.uploadMbps,
            latencyMs: p.latencyMs,
            jitterMs: p.jitterMs,
            packetLossPercent: p.packetLossPercent,
            priceEur: p.priceEur,
            installationFeeEur: p.installationFeeEur,
            contractMonths: p.contractMonths,
            dataLimitGB: p.dataLimitGB,
            tvIncluded: p.tvIncluded,
            phoneIncluded: p.phoneIncluded,
            routerIncluded: p.routerIncluded,
            cgnat: p.cgnat,
            ipv6Support: p.ipv6Support,
            scoreGaming: p.scoreGaming,
            scoreStreaming: p.scoreStreaming,
            scoreWork: p.scoreWork,
            scoreFamily: p.scoreFamily,
            availability: p.availability,
            promotionActive: p.promotionActive,
            promotionDescription: p.promotionDescription,
          })),
        },
      });
    }

    const allPackages = await db.select().from(provideri).orderBy(asc(provideri.providerName));

    const providerMap = new Map<
      string,
      {
        name: string;
        slug: string;
        packageCount: number;
        cities: Set<string>;
        accessTypes: Set<string>;
        minPrice: number;
        maxPrice: number;
        maxSpeed: number;
        avgGaming: number;
        avgStreaming: number;
        avgWork: number;
        avgFamily: number;
        hasPromotion: boolean;
        websiteUrl: string | null;
      }
    >();

    for (const pkg of allPackages) {
      const key = pkg.providerName.toLowerCase();
      if (!providerMap.has(key)) {
        providerMap.set(key, {
          name: pkg.providerName,
          slug: pkg.providerName.toLowerCase().replace(/\s+/g, "-"),
          packageCount: 0,
          cities: new Set(),
          accessTypes: new Set(),
          minPrice: Infinity,
          maxPrice: -Infinity,
          maxSpeed: 0,
          avgGaming: 0,
          avgStreaming: 0,
          avgWork: 0,
          avgFamily: 0,
          hasPromotion: false,
          websiteUrl: pkg.websiteUrl,
        });
      }
      const entry = providerMap.get(key)!;
      entry.packageCount++;
      entry.cities.add(pkg.city);
      entry.accessTypes.add(pkg.accessType);
      entry.minPrice = Math.min(entry.minPrice, pkg.priceEur);
      entry.maxPrice = Math.max(entry.maxPrice, pkg.priceEur);
      entry.maxSpeed = Math.max(entry.maxSpeed, pkg.downloadMbps);
      entry.avgGaming += pkg.scoreGaming;
      entry.avgStreaming += pkg.scoreStreaming;
      entry.avgWork += pkg.scoreWork;
      entry.avgFamily += pkg.scoreFamily;
      if (pkg.promotionActive) entry.hasPromotion = true;
    }

    const providers = Array.from(providerMap.values()).map((p) => ({
      name: p.name,
      slug: p.slug,
      packageCount: p.packageCount,
      cities: [...p.cities].sort(),
      accessTypes: [...p.accessTypes].sort(),
      priceRange: { min: p.minPrice, max: p.maxPrice },
      maxSpeed: p.maxSpeed,
      avgScores: {
        gaming: Math.round(p.avgGaming / p.packageCount),
        streaming: Math.round(p.avgStreaming / p.packageCount),
        work: Math.round(p.avgWork / p.packageCount),
        family: Math.round(p.avgFamily / p.packageCount),
      },
      hasPromotion: p.hasPromotion,
      websiteUrl: p.websiteUrl,
    }));

    return NextResponse.json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (error: any) {
    console.error("[Trziste API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch provider data" },
      { status: 500 }
    );
  }
}
