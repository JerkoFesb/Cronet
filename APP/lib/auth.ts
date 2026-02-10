// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";   // ako koristiš Drizzle
import { db } from "@/db/index"
import * as schema from "@/db/schema";
// ili prismaAdapter, kyselyAdapter, mongodbAdapter, ...

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    // Faster password hashing (10 rounds instead of default 12)
    // Still secure but ~4x faster login
    password: {
      hash: async (password) => {
        const bcrypt = await import('bcryptjs');
        return bcrypt.hash(password, 10);
      },
      verify: async (data) => {
        const bcrypt = await import('bcryptjs');
        return bcrypt.compare(data.password, data.hash);
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // korisni pluginovi (dodaj po potrebi)
  plugins: [
    // twoFactor(),               // 2FA
    // organization(),            // multi-tenant / timovi
    // passkey(),                 // WebAuthn / passkeys
  ],

  // session: { strategy: "jwt" },   // default je JWT + cookie
});
