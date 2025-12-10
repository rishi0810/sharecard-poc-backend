import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.get("/", (req, res) => {
  const { gt, score, pos } = req.query;
  const htmlPath = path.join(__dirname, "static", "test.html");
  fs.readFile(htmlPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading HTML file");
      return;
    }
    let html = data;
    html = html.replace(/\$\{gt\}/g, gt || "Default gt");
    html = html.replace(/\$\{score\}/g, score || "Default score");
    html = html.replace(/\$\{pos\}/g, pos || "Default pos");
    
    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable"
    );
    
    res.send(html);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
