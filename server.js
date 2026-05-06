const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 8080;
const rootDir = __dirname;
const scenariosPath = path.join(rootDir, "data", "scenarios.json");

const readScenarios = () => {
  const raw = fs.readFileSync(scenariosPath, "utf8");
  return JSON.parse(raw);
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
};

const sendFile = (res, filePath) => {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(rootDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(resolved, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    const ext = path.extname(resolved);
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "text/plain" });
    res.end(content);
  });
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/healthz") {
    return sendJson(res, 200, { status: "ok" });
  }

  if (url.pathname === "/api/scenarios") {
    return sendJson(res, 200, readScenarios());
  }

  if (url.pathname === "/api/impact") {
    const site = url.searchParams.get("site") || "campus";
    const scenarios = readScenarios();
    return sendJson(res, 200, scenarios[site] || scenarios.campus);
  }

  const filePath = url.pathname === "/" ? path.join(rootDir, "index.html") : path.join(rootDir, url.pathname);
  return sendFile(res, filePath);
});

server.listen(port, () => {
  console.log(`WellFuel running on port ${port}`);
});
