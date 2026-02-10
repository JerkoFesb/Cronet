import 'dotenv/config';
import { db } from "../db";
import { provideri } from "../db/schema";
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

type ProviderCsv = {
  id: string;
  providerName: string;
  packageName: string;
  city: string;
  region?: string | null;
  accessType: string;
  downloadMbps: number;
  uploadMbps: number;
  latencyMs: number;
  jitterMs: number;
  packetLossPercent: number;
  cgnat: boolean;
  ipv6Support: boolean;
  priceEur: number;
  installationFeeEur: number;
  contractMonths: number;
  dataLimitGB?: number | null;
  tvIncluded?: boolean;
  phoneIncluded?: boolean;
  routerIncluded?: boolean;
  scoreGaming: number;
  scoreStreaming: number;
  scoreWork: number;
  scoreFamily: number;
  availability: string;
  promotionActive?: boolean;
  promotionDescription?: string | null;
  websiteUrl?: string;
};

async function seedProvideri() {
  try {
    console.log('🌱 Seeding provideri...');

    const csvPath = path.join(process.cwd(), 'db', 'seed-data', 'provideri.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        if (value === '') return null;
        
        if (value === 'true') return true;
        if (value === 'false') return false;
        
        if (context.column === 'downloadMbps' || 
            context.column === 'uploadMbps' || 
            context.column === 'latencyMs' || 
            context.column === 'jitterMs' ||
            context.column === 'contractMonths' ||
            context.column === 'dataLimitGB' ||
            context.column === 'scoreGaming' ||
            context.column === 'scoreStreaming' ||
            context.column === 'scoreWork' ||
            context.column === 'scoreFamily') {
          return value ? parseInt(value) : null;
        }
        
        if (context.column === 'packetLossPercent' || 
            context.column === 'priceEur' ||
            context.column === 'installationFeeEur') {
          return value ? parseFloat(value) : null;
        }
        
        return value;
      }
    }) as ProviderCsv[];

    console.log(`📊 Found ${records.length} records in CSV`);

    for (const record of records) {
      await db.insert(provideri).values(record).onConflictDoNothing();
      console.log(`✅ Inserted: ${record.providerName} - ${record.packageName} (${record.city})`);
    }

    console.log('🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedProvideri();
