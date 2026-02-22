import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  // OPTIONAL protection (recommended for prod)
  if (process.env.LOGS_SECRET) {
    if (req.headers.authorization !== `Bearer ${process.env.LOGS_SECRET}`) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const raw = await redis.lrange("fm:events", 0, 99);
    const logs = raw.map((r) => JSON.parse(r));

    return res.status(200).json(logs);
  } catch (err) {
    console.error("LOG READ ERROR:", err);
    return res.status(500).json([]);
  }
}
