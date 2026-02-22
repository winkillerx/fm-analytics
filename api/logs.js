// api/logs.js

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(globalThis.FM_LOGS || []);
}
