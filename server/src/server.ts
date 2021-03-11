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

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

import spdy from "spdy";
import http from "http";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import { http_server as braidify } from "braidify";
import { serverApi } from "./serverApi";

const port = process.env.PORT || 3000;

const useHTTP2 = process.argv.includes("--http2");

const app = express()
  .use(cors({ origin: true }))
  .use(braidify);

// Add our Ribbon request handlers
serverApi(app);

let server;
if (useHTTP2) {
  server = spdy.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "..", "keys", "key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "..", "keys", "cert.pem")),
    },
    app
  );
} else {
  server = http.createServer(app);
}

server.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else if (useHTTP2) {
    console.log(`HTTP 2.0 server is listening on ${port} with TLS`);
  } else {
    console.log(`HTTP 1.1 server is listening on ${port}`);
  }
});
