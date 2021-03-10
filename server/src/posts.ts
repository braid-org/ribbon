import { Post, initialPosts } from "./initialPosts";
import { Resource, update } from "./resource";
import { send, error } from "./utils";
import { Router } from "express";
export { Post } from './initialPosts'

export const router = new Router()

export function makePosts(urlPrefix): Resource<Array<Post>> {
  return {
    version: 0,
    subscriptions: new Set(),
    value: [...initialPosts],
    urlPrefix
  };
}

const asData = (prefix: string) => (posts: Array<Post>) => {
  return posts.map((post, i) => ({
    resource: `${prefix}/post/${i}`,
    post,
  }));
}

router.get("/", (request, response) => {
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

router.put("/", async (request, response) => {
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
