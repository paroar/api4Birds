const express = require("express");
const serverless = require("serverless-http");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var poll = require("./oscarsPoll.json");

var app = express();
var port = process.env.PORT || 3000;

const options = {
  swaggerDefinition: {
    info: {
      title: "4Birds API",
      description: "4Birds API Information",
      contact: {
        name: "Amazing Developer"
      },
      servers: ["http://localhost:3000"]
    },
    "paths": {
      "/getOscarsPoll": {
        "get": {
          "x-swagger-router-controller": "home",
          "summary": "Get nominations",
          "operationId": "index",
          "tags": ["oscars"],
          "description": "Get all the nominations for the Oscars gala 2020",
          "parameters": [],
          "responses": {}
        }
      },
      "/getOscarsPoll/topic?topic={topic}": {
        "get": {
          "x-swagger-router-controller": "bar",
          "summary": "Select nominations by topic",
          "operationId": "impossible",
          "tags": ["oscars"],
          "description": "",
          "parameters": [
            {
              name: "topic",
              in: "path",
              description: "Topic of the nomination",
              required: true,
              type: "string"
            }
          ],
          "responses": {
            "200": {
              description: "successful operation",
              schema: {
                $ref: "#/definitions/Oscar"
              }
            },
            "400": {
              description: "Invalid username supplied"
            },
            "404": {
              description: "User not found"
            }
          }
        }
      },
      "/getOscarsPoll/nominations?nominations={nomination}": {
        "get": {
          "x-swagger-router-controller": "bar",
          "summary": "Select nominations for film/actor",
          "operationId": "impossible",
          "tags": ["oscars"],
          "description": "",
          "parameters": [{
            name: "nomination",
            in: "path",
            description: "Person or film to return",
            required: true,
            type: "string"
          }],
          "responses": {
            "200": {
              description: "successful operation",
              schema: {
                $ref: "#/definitions/Oscar"
              }
            },
            "400": {
              description: "Invalid username supplied"
            },
            "404": {
              description: "User not found"
            }
          }
        }
      }
    },
    definitions: {
      "Oscar": {
        "type": "object",
        "properties": {
          "nomination": {
            "type": "object",
            "properties": {
              "username": {
                "type": "string"
              },
              "firstName": {
                "type": "string"
              },
              "lastName": {
                "type": "string"
              }
            }
          }
        }
      }
    }

  },
  apis: ["app.js"]
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, function () {
  console.log(`Example app listening on port !`);
});

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
