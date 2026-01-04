import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";

export const auth = betterAuth({
  // Configure Drizzle as the database adapter
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  // Configure email and password authentication
  emailAndPassword: {
    enabled: true,
  },

  // Configure advanced options
  advanced: {
    cookiePrefix: "flowpad",
  },
  trustedOrigins: [
    "http://localhost:5173",
    process.env.FRONTEND_URL || "https://flow-pad.vercel.app",
  ],
});
