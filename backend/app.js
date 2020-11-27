"use strict";

const http = require("http");
const fs = require("fs");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongo = require('./database/mongo.js')
const home= require("./routes/home.js")

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',home);




const server = http
  .createServer(app)
  .listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));

module.exports = { app, server };

server.on("close", () => {
  console.log("HTTP server is closed");
  process.exit(0);
});

// If there is an unhandled promise rejection, we throw it and let the uncaughtException handler handle it
process.on("unhandledRejection", reason => {
  throw reason;
});

process.on("uncaughtException", reason => {
  if (reason) console.log(reason);
  process.exit(1);
});

// If the process is getting killed by CTRL+C, first close the server, before interrupting the process. Only then, exit with success code
process.on("SIGINT", () => {
  console.log("SIGINT signal received, closing the server");
  server.close(() => {
    console.log("Server closed");

  });
});

// If the process is getting terminated by a 'kill ${PID}' command, first close the server, before interrupting the process. Only then, exit with success code
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received, closing the server");
  server.close(() => {
    console.log("Server closed");

  });
});
