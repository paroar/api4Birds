var express = require("express");
const serverless = require("serverless-http");
var poll = require("./oscarsPoll.json");

var app = express();
var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Example app listening on port !`);
  });

const router = express.Router();

router.get("/getOscarsPoll", (req, res) => {
  res.json(poll);
});

router.get("/getOscarsPoll/topic", (req, res) => {
  let queryResults = poll.results.filter(t =>
    t.topic.toLowerCase().includes(req.query.topic.toLowerCase())
  );
  res.json(queryResults);
});

router.get("/getOscarsPoll/nominations", (req, res) => {
  let queryResults = poll.results.filter(ns =>
    ns.nominations.filter(n =>
      n.name
        .toLocaleLowerCase()
        .includes(req.query.nominations.toLocaleLowerCase())
    ).length > 0
  );
  res.json(queryResults);
});

app.use("/",router);

module.exports.handler = serverless(app);
