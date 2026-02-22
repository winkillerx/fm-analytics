import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  // CORS (safe for analytics)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const event = {
      ...req.body,
      ip: req.headers["x-forwarded-for"] || "unknown",
      ua: req.headers["user-agent"] || "unknown",
      ts: Date.now(),
    };

    await redis.lpush("fm:events", JSON.stringify(event));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("TRACK ERROR:", err);
    return res.status(500).json({ error: "track failed" });
  }
}
