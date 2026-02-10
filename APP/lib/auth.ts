import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index"
import * as schema from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://cronet.vercel.app",
  ],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
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
});
