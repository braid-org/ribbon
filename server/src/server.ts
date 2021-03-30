/**
 * This is the entrypoint for running the Ribbon server from the command
 * line. We require HTTP 2.0:
 *
 *   $ ts-node-dev src/server.ts
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
import fs from "fs";

import { app } from "./app";
import { port, key, cert } from "./config";

export const server = spdy.createServer(
  {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert),
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
