// api/logs.js
import { logs } from "./track.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(logs.slice().reverse());
}
