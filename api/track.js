// api/track.js
import crypto from "crypto";

/**
 * In-memory event log (resets on cold start)
 */
export const logs = [];

/**
 * Basic bot filter
 */
function isBot(req) {
  const ua = req.headers["user-agent"] || "";
  return /bot|crawl|spider|slurp|facebook|discord|preview/i.test(ua);
}

/**
 * Extract IP (Cloudflare / Vercel aware)
 */
function getIP(req) {
  return (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (isBot(req)) {
    return res.json({ ok: true, bot: true });
  }

  try {
    const body = req.body || {};
    const ip = getIP(req);

    const event = {
      time: new Date().toISOString(),
      event: body.event || "unknown",
      page: body.page || "/",
      title: body.title || null,
      id: body.id || null,
      type: body.type || null,
      query: body.query || null,
      ip,
      ua: req.headers["user-agent"] || "unknown"
    };

    logs.push(event);
    if (logs.length > 200) logs.shift();

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Tracking failed" });
  }
}
