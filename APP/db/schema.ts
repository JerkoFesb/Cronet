import { pgTable, text, timestamp, boolean, index, integer, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  providerName: text("provider_name").notNull(),
  packageName: text("package_name").notNull(),
  city: text("city").notNull(),
  region: text("region"),
  accessType: text("access_type").notNull(),
  downloadMbps: integer("download_mbps").notNull(),
  uploadMbps: integer("upload_mbps").notNull(),
  latencyMs: integer("latency_ms").notNull(),
  jitterMs: integer("jitter_ms").notNull(),
  packetLossPercent: real("packet_loss_percent").notNull(),
  cgnat: boolean("cgnat").notNull(),
  ipv6Support: boolean("ipv6_support").notNull(),
  priceEur: real("price_eur").notNull(),
  installationFeeEur: real("installation_fee_eur").notNull(),
  contractMonths: integer("contract_months").notNull(),
  dataLimitGB: integer("data_limit_gb"),
  tvIncluded: boolean("tv_included").default(false),
  phoneIncluded: boolean("phone_included").default(false),
  routerIncluded: boolean("router_included").default(true),
  scoreGaming: integer("score_gaming").notNull(),
  scoreStreaming: integer("score_streaming").notNull(),
  scoreWork: integer("score_work").notNull(),
  scoreFamily: integer("score_family").notNull(),
  availability: text("availability").notNull(),
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
