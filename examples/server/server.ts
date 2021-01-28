import * as express from "express";
import { braidify } from "braidjs";

const app = express().use(braidify);
const port = 3000;

app.get("/", (req, res) => {
  res.send(`The sedulous hyena ate the zookeeper!`);
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
