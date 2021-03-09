import spdy from "spdy";
import polka from "polka";
import cors from "cors";
import fs from "fs";
import path from "path";

import { http_server } from "braidjs";
import { ribbonAPI } from './api'

const port = process.env.PORT || 3000;

// Note: to use HTTP2 on localhost, you may need to enable chrome://flags/#allow-insecure-localhost
const useHTTP2 = process.argv.includes("--http2");
let server;
if (useHTTP2) {
  server = spdy.createServer({
    key: fs.readFileSync(path.join(__dirname, "..", "keys", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "keys", "cert.pem")),
  });
}

const app = polka({ server })
  .use(cors({ origin: true }))
  .use(http_server)

// Add request handlers
ribbonAPI(app);

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else if (useHTTP2) {
    console.log(`HTTP 2.0 server is listening on ${port} with TLS`);
  } else {
    console.log(`HTTP 1.1 server is listening on ${port}`);
  }
});
