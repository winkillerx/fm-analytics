import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";

const app = express();

app.use(cors({ origin: "https://filmmatrix.net" }));
app.use(express.json());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100
}));

app.post("/track", (req, res) => {
  const uaString = req.headers["user-agent"] || "";

  // 🧹 bot filter
  if (/bot|crawl|spider|slurp/i.test(uaString)) {
    return res.json({ ok: true });
  }

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const geo = geoip.lookup(ip);
  const ua = new UAParser(uaString).getResult();

  console.log({
    time: new Date().toISOString(),
    ip,
    country: geo?.country,
    device: ua.device.type || "desktop",
    browser: ua.browser.name,
    os: ua.os.name,
    event: req.body.event
  });

  res.json({ ok: true });
});

app.get("/health", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Analytics running"));
