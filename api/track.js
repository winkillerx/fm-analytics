// api/track.js

// In-memory log store (resets on cold start — expected on Vercel)
let LOGS = global.__FM_LOGS || [];
global.__FM_LOGS = LOGS;

export default function handler(req, res) {
  /* ============================================================
     CORS (CRITICAL)
     ============================================================ */

  const ALLOWED_ORIGINS = [
    "https://filmmatrix.net",
    "https://www.filmmatrix.net"
  ];

  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  /* ============================================================
     Bot filter
     ============================================================ */

  const ua = req.headers["user-agent"] || "";
  if (/bot|crawl|spider|slurp/i.test(ua)) {
    return res.json({ ok: true });
  }

  /* ============================================================
     Extract request data
     ============================================================ */

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const { event, page, ...meta } = req.body || {};

  /* ============================================================
     Store log entry
     ============================================================ */

  const entry = {
    time: new Date().toISOString(),
    event: event || "unknown",
    page: page || "",
    ip,
    ua,
    meta
  };

  LOGS.push(entry);

  // Prevent memory abuse
  if (LOGS.length > 1000) {
    LOGS = LOGS.slice(-500);
    global.__FM_LOGS = LOGS;
  }

  /* ============================================================
     Response
     ============================================================ */

  return res.json({ ok: true });
}
