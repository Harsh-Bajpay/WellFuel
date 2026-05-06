const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const scenariosPath = path.join(rootDir, "data", "scenarios.json");

const readScenarios = () => {
  try {
    const raw = fs.readFileSync(scenariosPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Scenario data unavailable. Ensure data/scenarios.json exists and is valid.", error);
    return null;
  }
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

const buildServer = () =>
  http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/healthz") {
      return sendJson(res, 200, { status: "ok" });
    }

    if (url.pathname === "/api/scenarios") {
      const scenarios = readScenarios();
      if (!scenarios) return sendJson(res, 500, { error: "Scenario data unavailable." });
      return sendJson(res, 200, scenarios);
    }

    if (url.pathname === "/api/impact") {
      const site = url.searchParams.get("site") || "campus";
      const scenarios = readScenarios();
      if (!scenarios) return sendJson(res, 500, { error: "Scenario data unavailable." });
      return sendJson(res, 200, scenarios[site] || scenarios.campus);
    }

    const filePath = url.pathname === "/" ? path.join(rootDir, "index.html") : path.join(rootDir, url.pathname);
    return sendFile(res, filePath);
  });

const startServer = (requestedPort = process.env.PORT || 8080) => {
  const server = buildServer();
  server.listen(requestedPort, () => {
    const activePort = server.address().port;
    console.log(`WellFuel running on port ${activePort}`);
  });
  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { buildServer, startServer };
