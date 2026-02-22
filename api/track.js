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
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // INIT LOG STORE (per warm instance)
  globalThis.FM_LOGS ??= [];

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const log = {
    time: new Date().toISOString(),
    ip,
    ua: req.headers["user-agent"] || "",
    event: req.body?.event || "unknown",
    page: req.body?.page || "",
  };

  globalThis.FM_LOGS.unshift(log);
  globalThis.FM_LOGS = globalThis.FM_LOGS.slice(0, 100);

  return res.status(200).json({ ok: true });
}
