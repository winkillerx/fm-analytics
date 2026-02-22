// api/track.js

let LOGS = globalThis.FM_LOGS || [];
globalThis.FM_LOGS = LOGS;

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
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ua = req.headers["user-agent"] || "";
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const body = req.body || {};

  const entry = {
    time: new Date().toISOString(),
    event: body.event || "unknown",
    page: body.page || "",
    title: body.title || "",
    type: body.type || "",
    ip,
    userAgent: ua,
    device: /mobile/i.test(ua) ? "mobile" : "desktop"
  };

  LOGS.push(entry);

  // Keep last 200 logs only
  if (LOGS.length > 200) {
    LOGS.splice(0, LOGS.length - 200);
  }

  res.status(200).json({ ok: true });
}
