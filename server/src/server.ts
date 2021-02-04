import polka from "polka";
import cors from "cors";

import braidify from "./braid/braid-server";
import { Resource } from "./braid";

// const subscriptions = [
//   { url: "http://localhost:3001/alice/posts" },
//   { url: "http://localhost:3001/bob/posts" },
//   { url: "http://localhost:3001/charlie/posts" },
// ];

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

const blog: Resource<Array<any>> = new Resource(posts);

const app = polka()
  .use(cors({ origin: true }))
  .use(braidify);
const port = 3000;

app.get("/", (req, res) => {
  blog.respond(req, res);
});

app.patch("/", async (req, res) => {
  var patches = await req.patches();

  // assert(patches.length === 1);
  // assert(patches[0].range === "[-0:-0]");

  console.log("patches", patches);
  // blog.append(req, res, { title: "new blog post", body: "stuff" });
  // blog.store.set((state) => [...state, { title: "hi" }]);
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
