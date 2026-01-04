import { Hono } from "hono";
import { auth } from "./auth.js";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import path from "path";

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
  return c.text("🤑 I am alive!");
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
