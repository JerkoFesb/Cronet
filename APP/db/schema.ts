import { pgTable, text, timestamp, boolean, index, integer, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(), // <-- OBAVEZNO
});
export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);


export const provideri = pgTable("provideri", {
  id: text("id").primaryKey(),
  providerName: text("provider_name").notNull(), // A1, HT, Telemach, Iskon, Evo
  packageName: text("package_name").notNull(), // npr. "Optika 200", "MAX Speed 500"
  city: text("city").notNull(), // Zagreb, Split, Rijeka, Osijek, itd.
  region: text("region"), // Dalmacija, Slavonija, Istra, itd.
  accessType: text("access_type").notNull(), // FTTH, DOCSIS, DSL, 5G, Fixed Wireless
  downloadMbps: integer("download_mbps").notNull(),
  uploadMbps: integer("upload_mbps").notNull(),
  latencyMs: integer("latency_ms").notNull(), // Prosječna latencija
  jitterMs: integer("jitter_ms").notNull(), // Varijacija latencije
  packetLossPercent: real("packet_loss_percent").notNull(), // npr. 0.1 = 0.1%
  cgnat: boolean("cgnat").notNull(), // Carrier-Grade NAT (loše za gaming)
  ipv6Support: boolean("ipv6_support").notNull(),
  priceEur: real("price_eur").notNull(), // Mjesečna cijena
  installationFeeEur: real("installation_fee_eur").notNull(), // Jednokratna naknada
  contractMonths: integer("contract_months").notNull(), // 0 = bez ugovorne obveze
  dataLimitGB: integer("data_limit_gb"), // null = unlimited
  tvIncluded: boolean("tv_included").default(false), // Da li uključuje TV
  phoneIncluded: boolean("phone_included").default(false), // Da li uključuje telefon
  routerIncluded: boolean("router_included").default(true), // Da li daju router
  scoreGaming: integer("score_gaming").notNull(), // 1-10 ocjena za gaming
  scoreStreaming: integer("score_streaming").notNull(), // 1-10 ocjena za streaming
  scoreWork: integer("score_work").notNull(), // 1-10 ocjena za rad od kuće
  scoreFamily: integer("score_family").notNull(), // 1-10 ocjena za obitelj
  availability: text("availability").notNull(), // "excellent", "good", "limited", "poor"
  promotionActive: boolean("promotion_active").default(false),
  promotionDescription: text("promotion_description"),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
