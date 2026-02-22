// /api/logs.js

let LOGS = global.__FM_LOGS || [];
global.__FM_LOGS = LOGS;

export default function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://www.filmmatrix.net");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(LOGS.slice(-200).reverse());
}
