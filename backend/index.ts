import { Hono } from "hono";
import { auth } from "./auth";
import { cors } from "hono/cors";

import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => origin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const port = process.env.PORT || 8080;
console.log(`Server is running on port ${port}`);

import { db } from "./db";
import { sql } from "drizzle-orm";

app.get("/", async (c) => {
  try {
    await db.execute(sql`SELECT 1`);
    return c.text("🤑 I am alive! and DB is Connected 🤩");
  } catch (error) {
    return c.text("🤑 I am alive! but DB is Disconnected 😭");
  }
});

serve({
  fetch: app.fetch,
  port: Number(port),
});
