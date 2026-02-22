import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  // 🔑 CORS — REQUIRED
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔑 Preflight — MUST END RESPONSE
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const event = {
      ...req.body,
      ts: Date.now(),
    };

    await redis.lpush("fm:events", JSON.stringify(event));

    // 🔑 ALWAYS end response
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("TRACK ERROR:", err);
    res.status(500).json({ error: "track failed" });
  }
}
