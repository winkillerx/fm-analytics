// /api/logs.js
const ALLOWED_ORIGINS = [
  "https://filmmatrix.net",
  "https://www.filmmatrix.net"
];

export default function handler(req, res) {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const logs = globalThis.FM_LOGS || [];
  res.status(200).json({ logs });
}
