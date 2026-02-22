// api/track.js

let LOGS = global.__FM_LOGS || [];
global.__FM_LOGS = LOGS;

const ALLOWED_ORIGINS = [
  "https://filmmatrix.net",
  "https://www.filmmatrix.net"
];

export default function handler(req, res) {
  const origin = req.headers.origin;

  // ✅ Dynamic CORS (CRITICAL)
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  // ✅ Preflight MUST exit cleanly
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ❌ Block anything else
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ua = req.headers["user-agent"] || "";

  // 🤖 Bot filter
  if (/bot|crawl|spider|slurp/i.test(ua)) {
    return res.json({ ok: true });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  let body = {};
  try {
    body = req.body || {};
  } catch {}

  const entry = {
    time: new Date().toISOString(),
    ip,
    event: body.event || "unknown",
    page: body.page || "",
    ua
  };

  LOGS.push(entry);

  // keep memory safe
  if (LOGS.length > 500) LOGS.shift();

  return res.json({ ok: true });
}
