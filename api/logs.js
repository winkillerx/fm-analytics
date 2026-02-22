// api/logs.js

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

  res.status(200).json(globalThis.FM_LOGS || []);
}
