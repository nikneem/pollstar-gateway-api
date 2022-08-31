var express = require("express");
var router = express.Router();
const version = process.env.GATEWAY_VERSION || 'unknown';

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Container Apps Demo", version: version });
});

module.exports = router;