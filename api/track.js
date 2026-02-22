export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uaString = req.headers["user-agent"] || "";

  // 🧹 Bot filter
  if (/bot|crawl|spider|slurp/i.test(uaString)) {
    return res.status(200).json({ ok: true });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    "unknown";

  // Log (for now — later we persist)
  console.log({
    time: new Date().toISOString(),
    ip,
    ua: uaString,
    event: req.body?.event,
    page: req.body?.page
  });

  return res.status(200).json({ ok: true });
}
