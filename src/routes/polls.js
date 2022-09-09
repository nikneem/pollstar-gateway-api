var express = require("express");
var router = express.Router();
const axios = require("axios").default;
const serviceName = process.env.POLLSTAR_POLLS_API || "pollstar-polls-api";
const daprPort = process.env.DAPR_HTTP_PORT || 80;

//use dapr http proxy (header) to call orders service with normal /order route URL in axios.get call
const daprSidecar = `http://localhost:${daprPort}`;

// POST > /polls
router.post("/", async function (req, res, next) {
  const session = req.body;
  const targetUrl = `${daprSidecar}/api/polls`;
  console.log(
    `Service invoke to: ${targetUrl} with body ${JSON.stringify(session)}`
  );
  var data = await axios.post(targetUrl, session, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

// GET > /polls/{id}
router.get("/", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/polls?session=${req.query.session}`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

// GET > /polls/{id}
router.get("/:id", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/polls/${req.params.id}`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

// GET > /polls/{id}/active
router.get("/:id/active", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/polls/${req.params.id}/active`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

// PUT > /polls/{id}
router.put("/:id", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/polls/${req.params.id}`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.put(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

// DELETE > /polls/{id}
router.delete("/:id", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/polls/${req.params.id}`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.defaults(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

// GET > /polls/{id}/activate
router.get("/:id/activate", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/polls/${req.params.id}/activate`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

module.exports = router;
