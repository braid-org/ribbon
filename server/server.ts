import { SubscribableValue } from "braidjs";

import * as polka from "polka";
import * as cors from "cors";

const subscriptions = [
  { url: "http://localhost:3001/alice/posts" },
  { url: "http://localhost:3001/bob/posts" },
  { url: "http://localhost:3001/charlie/posts" },
];

const posts = [
  { title: "hello." },
  { title: "Welcome to\nThe Braid." },
  {
    title: "A microblog you own",
    body:
      `Braid isn't satisfied to be yet another proprietary platform ` +
      `or protocol. We're working with the IETF to augment the HTTP ` +
      `standard so that subscribing and collaborating is native to the web.`,
  },
  {
    body:
      `Share your life, and share how you see life. This microblog ` +
      `supports tweaking and sharing attention functions--no longer ` +
      `will you be subject to someone else's attention algorithm.`,
  },
];

const blog = new SubscribableValue(posts);
// published: new Date(Date.UTC(2021, 1, 1, 18, 30, 0)).toUTCString(),

const app = polka().use(cors({ origin: true }));
const port = 3000;

app.get("/", (req, res) => {
  blog.respond(req, res);
});

// app.patch("/", (req, res) => {
//   blog.append(req, res, {title:"new blog post",body:"stuff"})
// })

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
