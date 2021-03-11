import { origin } from "./config";
import { Resource, update } from "./resource";
import { send, error } from "./utils";
import { Router } from "express";

// Re-export 'Post' type
import { Post } from "./initialPosts";
export { Post } from "./initialPosts";

export const router = new Router();

export function makePosts(urlPrefix, initialPosts = []): Resource<Array<Post>> {
  return {
    version: 0,
    subscriptions: new Set(),
    value: [...initialPosts],
    urlPrefix,
  };
}

const asData = (prefix: string) => (posts: Array<Post>) => {
  return posts.map((post, i) => ({
    resource: `${prefix}/post/${i}`,
    post,
  }));
};

router.get("/post/:index", (request, response) => {
  const posts = request.author.posts;
  const idx = parseInt(request.params.index, 10);
  if (idx >= 0 && idx < posts.value.length) {
    const post = posts.value[idx];

    response.startSubscription();
    response.sendVersion({
      version: posts.version,
      body: JSON.stringify({
        resource: `${origin}${request.originalUrl}`,
        post,
      }),
    });
    // TODO: make "post" a resource that updates?
  } else {
    error(response, "out of range", 416);
  }
});

router.get("/posts", (request, response) => {
  const posts = request.author.posts;
  const postsData = asData(posts.urlPrefix)(posts.value);
  if (request.subscribe) {
    response.startSubscription();
    response.sendVersion({
      version: posts.version,
      body: JSON.stringify(postsData),
    });
    posts.subscriptions.add(response);
  } else {
    send(response, postsData);
  }
});

router.put("/posts", async (request, response) => {
  const posts = request.author.posts;
  const patches = await request.patches();
  if (patches.length > 0) {
    // Possibly more than one thing can be appended
    for (const patch of patches) {
      // We only accept appending via 'json' content-range type
      if (patch.unit === "json" && patch.range === "[-0:-0]") {
        const { title, body } = JSON.parse(patch.content);
        posts.value.push({ title, body });
      } else {
        error(response, "only appending to posts is supported");
        return;
      }
    }
  } else {
    error(response, "patch required");
  }

  // Increment version & send an update to any subscribers
  update(posts, asData(posts.urlPrefix));

  // Acknowledge post(s) appended
  send(response, { success: true });
});
