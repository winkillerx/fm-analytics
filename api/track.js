let LOGS = global.__FM_LOGS || [];
global.__FM_LOGS = LOGS;

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ua = req.headers["user-agent"] || "";

  if (/bot|crawl|spider|slurp/i.test(ua)) {
    return res.json({ ok: true });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const body = req.body || {};

  LOGS.push({
    time: new Date().toISOString(),
    ip,
    event: body.event || "unknown",
    page: body.page || "",
    ua
  });

  if (LOGS.length > 500) LOGS.shift();

  res.json({ ok: true });
}
