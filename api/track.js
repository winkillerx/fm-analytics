// /api/track.js

let LOGS = global.__FM_LOGS || [];
global.__FM_LOGS = LOGS;

export default function handler(req, res) {
  // ✅ CORS HEADERS (CRITICAL)
  res.setHeader("Access-Control-Allow-Origin", "https://www.filmmatrix.net");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const ua = req.headers["user-agent"] || "";

  // 🤖 Bot filter
  if (/bot|crawl|spider|slurp/i.test(ua)) {
    return res.json({ ok: true });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const log = {
    time: new Date().toISOString(),
    event: req.body?.event || "unknown",
    page: req.body?.page || "",
    ip,
    ua
  };

  LOGS.push(log);

  res.status(200).json({ ok: true });
}
