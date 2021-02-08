import polka from "polka";
import cors from "cors";

import braidify from "./braid/braid-server";
import { ListResource } from "./braid";

// const subscriptions = [
//   { url: "http://localhost:3001/alice/posts" },
//   { url: "http://localhost:3001/bob/posts" },
//   { url: "http://localhost:3001/charlie/posts" },
// ];

const initialPosts = [
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
      `lets you share attention functions--find the signal without being ` +
      `subject to someone else's attention algorithm.`,
  },
  { title: "Welcome to\nThe Braid." },
  { title: "hello." },
];

const posts: ListResource<any> = new ListResource();
const likes: ListResource<any> = new ListResource();

const app = polka()
  .use(cors({ origin: true }))
  .use(braidify);
const port = process.env.PORT || 3000;

app.get("/posts", (req, res) => {
  posts.get(req, res);
});

app.put("/posts", (req, res) => {
  posts.patch(req, res);
});

app.get("/likes", (req, res) => {
  likes.get(req, res);
});

app.get("/likes", (req, res) => {
  likes.patch(req, res);
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
