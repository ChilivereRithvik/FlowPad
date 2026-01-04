import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { config } from "dotenv";

config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://flow-pad.vercel.app",
      process.env.FRONTEND_URL,
    ].filter((url): url is string => !!url),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({ status: "alive", message: "FlowPad Backend" });
});

app.get("/api", (req, res) => {
  res.send("🤑 I am alive!");
});

export default app;
