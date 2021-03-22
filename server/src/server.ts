/**
 * This is the entrypoint for running the Ribbon server from the command
 * line. We offer plain HTTP 1.1 as well as HTTP 2.0:
 *
 *   HTTP 1.1
 *   $ ts-node-dev src/server.ts
 *
 *   HTTP 2.0 (via spdy)
 *   $ ts-node-dev src/server.ts --http2
 *
 *   Note: to use HTTP2 on localhost, you may need to allow self-signed
 *   certificates via chrome://flags/#allow-insecure-localhost
 *
 * If you're developing the server, note that `ts-node-dev` will auto-
 * matically compile typescript & restart the server whenever you make a
 * change to a .ts file.
 *
 */

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

import spdy from "spdy";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import { http_server as braidify } from "braidify";
import { serverApi } from "./serverApi";

const port = process.env.PORT || 3000;

const app = express()
  .use(cors({ origin: true }))
  .use(express.static('public'))
  .use(braidify);

// Add our Ribbon request handlers
serverApi(app);

const server = spdy.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "..", "keys", "localhost.key")),
    cert: fs.readFileSync(path.join(__dirname, "..", "keys", "localhost.cert")),
  },
  app
);

server.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`HTTP 2.0 server is listening on ${port} with TLS`);
  }
});
