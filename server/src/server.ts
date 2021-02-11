import spdy from "spdy";
import polka from "polka";
import cors from "cors";
import fs from "fs";
import path from "path";

import braidify from "./braid/braid-server";
import { Resource, ListResource, Link } from "./braid";

type Post = {
  index: number;
  title?: string;
  body?: string;
};

const postUrl = (post) => `/post/${post.index}`;

const initialPosts: Array<Post> = [
  {
    index: 0,
    title: "A microblog you own",
    body:
      `Braid isn't satisfied to be yet another proprietary platform ` +
      `or protocol. We're working with the IETF to augment the HTTP ` +
      `standard so that subscribing and collaborating is native to the web.`,
  },
  {
    index: 1,
    body:
      `Share your life, and share how you see life. This microblog ` +
      `lets you create and share attention functions--find the signal ` +
      `without being subject to someone else's algorithm.`,
  },
  { index: 2, title: "Welcome to\nThe Braid." },
  { index: 3, title: "hello." },
];

const resources = {
  /* prettier-ignore */
  posts: new ListResource((_) => `/posts`,
    initialPosts.map((post) => new Link(new Resource(postUrl, post)))
  ),
  likes: new ListResource((_) => `/likes`),
};

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
  .use(braidify);
const port = process.env.PORT || 3000;

app.get("/posts", (req, res) => {
  resources.posts.subscribe(req, res);
});

app.put("/posts", (req, res) => {
  resources.posts.patch(req, res);
});

app.get("/post/:n", (req, res) => {
  const n = parseInt(req.params.n, 10);
  const count = resources.posts.length;
  if (n >= 0 && n < count) {
    resources.posts.get(n).pointer.subscribe(req, res);
  } else {
    outOfRangeError(res);
  }
});

app.put("/post/:n", (req, res) => {
  const n = parseInt(req.params.n, 10);
  const count = resources.posts.store.get().length;

  if (n >= 0 && n < count) {
    // const post = req.body;
    // resources.posts.setAtIndex(n, post);
    // res.statusCode = 200;
    // res.end(JSON.stringify(post));
    resources.posts.get(n).pointer.patch(req, res);
  } else if (n === count) {
    const resource = new Resource(postUrl, { index: n });
    resource.patch(req, res).then(() => {
      console.log("added new link to resource", resource);
      resources.posts.push(new Link(resource));
    });
  } else {
    outOfRangeError(res);
  }
});

app.get("/likes", (req, res) => {
  resources.likes.subscribe(req, res);
});

app.put("/likes", (req, res) => {
  resources.likes.patch(req, res);
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else if (useHTTP2) {
    console.log(`HTTP 2.0 server is listening on ${port} with TLS`);
  } else {
    console.log(`HTTP 1.1 server is listening on ${port}`);
  }
});

function outOfRangeError(res) {
  res.statusCode = 400;
  res.end(JSON.stringify({ error: "out of range" }));
}
