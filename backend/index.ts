import { Hono } from "hono";
import { auth } from "./auth";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import path from "path";

import { db } from "./db";
import { sql } from "drizzle-orm";

// Only load .env in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

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

app.get("/", (c) => c.json({ status: "alive", message: "FlowPad Backend" }));

app.get("/api", async (c) => {
  try {
    await db.execute(sql`SELECT 1`);
    return c.text("🤑 I am alive! and DB is Connected 🤩");
  } catch (error) {
    return c.text("🤑 I am alive! but DB is Disconnected 😭");
  }
});

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "production") {
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port: Number(port),
  });
}

export default handle(app);
