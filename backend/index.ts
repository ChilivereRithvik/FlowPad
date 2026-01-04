import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { auth } from "./auth.js";

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: (origin) => origin || "",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/", (c) => c.text("🤑 I am alive!"));

export default handle(app);
