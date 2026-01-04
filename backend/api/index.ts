export const runtime = "nodejs";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { auth } from "./auth.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
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

app.get("/api", (c) => c.text("🤑 I am alive!"));

export default handle(app);
