// api/health.js
export default function handler(req, res) {
  res.json({
    ok: true,
    service: "fm-analytics",
    time: new Date().toISOString()
  });
}
