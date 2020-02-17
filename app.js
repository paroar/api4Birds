const express = require("express");
const serverless = require("serverless-http");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var poll = require("./oscarsPoll.json");

var app = express();
var port = process.env.PORT || 3000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "4Birds API",
      description: "4Birds API Information",
      contact: {
        name: "Amazing Developer"
      },
      servers: ["http://localhost:3000"]
    }
  },
  apis: ["app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, function() {
  console.log(`Example app listening on port !`);
});


/**
 * @swagger
 * /getOscarsPoll:
 * get:
 *  description: Use to request all customers
 *  responses:
 *    "200":
 *      description: A successful response
 */

app.get("/getOscarsPoll", (req, res) => {
  res.status(200).json(poll);
});

app.get("/getOscarsPoll/topic", (req, res) => {
  let queryResults = poll.results.filter(t =>
    t.topic.toLowerCase().includes(req.query.topic.toLowerCase())
  );
  res.json(queryResults);
});

app.get("/getOscarsPoll/nominations", (req, res) => {
  let queryResults = poll.results.filter(
    ns =>
      ns.nominations.filter(n =>
        n.name
          .toLocaleLowerCase()
          .includes(req.query.nominations.toLocaleLowerCase())
      ).length > 0
  );
  res.json(queryResults);
});

module.exports.handler = serverless(app);
