// /api/track.js

const ALLOWED_ORIGINS = [
  "https://filmmatrix.net",
  "https://www.filmmatrix.net"
];

export default function handler(req, res) {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // 🔒 Init global log store (persists per warm lambda)
  if (!globalThis.FM_LOGS) {
    globalThis.FM_LOGS = [];
  }

  const ua = req.headers["user-agent"] || "";
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const log = {
    time: new Date().toISOString(),
    ip,
    ua,
    event: req.body?.event || "unknown",
    page: req.body?.page || "",
  };

  // ✅ STORE LOG
  globalThis.FM_LOGS.unshift(log);

  // Limit memory (VERY important on Vercel)
  globalThis.FM_LOGS = globalThis.FM_LOGS.slice(0, 200);

  res.status(200).json({ ok: true });
}
