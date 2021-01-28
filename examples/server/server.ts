import express from "express";
import { hi } from "braidjs";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(`${hi()}! The sedulous hyena ate the zookeeper!`);
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
