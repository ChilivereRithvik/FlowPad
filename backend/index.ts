export const runtime = "nodejs";

import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
import { auth } from "./auth.js";

const app = new Hono();

/* ✅ Manual CORS for Node */
app.use("*", async (c, next) => {
  const origin = c.req.header("origin") ?? "*";

  c.header("Access-Control-Allow-Origin", origin);
  c.header("Access-Control-Allow-Credentials", "true");
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
});

/* Auth */
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

/* Health */
app.get("/", (c) => c.json({ status: "alive", message: "FlowPad Backend" }));

export default getRequestListener(app.fetch);
