import express from "express";
import cors from "cors";

import { http_server as braidify } from "braidify";
import { serverApi } from "./serverApi";

import * as config from "./config";

// Middleware to pass config to client
function ribbonConfig(_, res) {
  res.send(`window.ribbon_config = ${JSON.stringify(config)};`)
}

export const app = express()
  .use(cors({ origin: true }))
  .use('/config.js', ribbonConfig)
  .use(express.static("public"))
  .use(braidify);

// Add our Ribbon request handlers
serverApi(app);



