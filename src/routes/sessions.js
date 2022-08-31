var express = require("express");
var router = express.Router();
const axios = require("axios").default;
const serviceName =
  process.env.POLLSTAR_SESSIONS_API || "pollstar-sessions-api";
const daprPort = process.env.DAPR_HTTP_PORT || 80;

//use dapr http proxy (header) to call orders service with normal /order route URL in axios.get call
const daprSidecar = `http://localhost:${daprPort}`;

router.get("/:id", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/sessions/${req.params.id}?userId=${req.query.userId}`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});
router.get("/:code/details", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/sessions/${req.params.code}/details/?userId=${req.query.userId}`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});
router.get("/:id/realtime", async function (req, res, next) {
  const targetUrl = `${daprSidecar}/api/sessions/${req.params.id}/realtime`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});
// /* POST create order by calling order microservice via dapr */
router.post("/", async function (req, res, next) {
  const session = req.body;
  const targetUrl = `${daprSidecar}/api/sessions`;
  console.log(
    `Service invoke to: ${targetUrl} with body ${JSON.stringify(session)}`
  );
  var data = await axios.post(targetUrl, session, {
    headers: { "dapr-app-id": `${serviceName}` }, //sets app name for service discovery
  });

  res.setHeader("Content-Type", "application/json");
  res.send(`${JSON.stringify(data.data)}`);
});

// /* DELETE order by calling order microservice via dapr */
// router.post('/delete', async function(req, res ) {

//   var data = await axios.delete(`${daprSidecar}/order?id=${req.body.id}`, {
//     headers: {'dapr-app-id': `${serviceName}`}
//   });

//   res.setHeader('Content-Type', 'application/json');
//   res.send(`${JSON.stringify(data.data)}`);
// });

module.exports = router;
