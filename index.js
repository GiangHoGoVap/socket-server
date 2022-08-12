var express = require("express");

var app = express();

const http = require("http");
const server = http.Server(app);
const { setSocketInstance } = require("./socket");
setSocketInstance(server);

app.get("/", (req, res) => {
  res.status(200).send("Hello user!");
});

server.listen(process.env.PORT || 4000, "0.0.0.0", function () {
  console.log("Listening on port: " + server.address().port);
});
