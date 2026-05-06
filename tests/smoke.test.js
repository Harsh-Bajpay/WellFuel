const assert = require("assert");
const http = require("http");
const { startServer } = require("../server");

const request = (port, path) =>
  new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path, method: "GET" }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.end();
  });

const run = async () => {
  const server = startServer(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  try {
    const health = await request(port, "/healthz");
    assert.strictEqual(health.statusCode, 200);
    assert.strictEqual(JSON.parse(health.body).status, "ok");

    const scenarios = await request(port, "/api/scenarios");
    assert.strictEqual(scenarios.statusCode, 200);
    const payload = JSON.parse(scenarios.body);
    assert.ok(payload.campus);

    const impact = await request(port, "/api/impact?site=campus");
    assert.strictEqual(impact.statusCode, 200);
    assert.strictEqual(JSON.parse(impact.body).name, payload.campus.name);
  } finally {
    server.close();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
