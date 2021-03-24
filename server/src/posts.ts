import { Router } from "express";

import { origin } from "./config";
import { update } from "./resource";
import { send, error } from "./utils";
import { asRecords } from "./makePosts";
import { postsPageHtml } from "./mf2html";
import { saveAuthor } from "./persistence";

export const router = new Router();

router.get("/post/:index", (request, response) => {
  const posts = request.author.posts;
  const idx = parseInt(request.params.index, 10);
  if (idx >= 0 && idx < posts.value.length) {
    const post = posts.value[idx];
    const record = {
      resource: `${origin}${request.originalUrl}`,
      post,
    };
    if (request.subscribe) {
      response.startSubscription();
      response.sendVersion({
        version: posts.version,
        body: JSON.stringify(record),
      });
    } else {
      send(response, record);
    }
  } else {
    error(response, "out of range", 416);
  }
});

router.get("/posts", (request, response) => {
  const posts = request.author.posts;
  const postsData = asRecords(posts.urlPrefix)(posts.value);
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

/**
 * Support mf2 format for compatibility with IndieWeb
 */
router.get("/posts.html", (request, response) => {
  const posts = request.author.posts;
  const postsData = asRecords(posts.urlPrefix)(posts.value);
  const html = postsPageHtml(
    request.author.shortname,
    posts.urlPrefix,
    postsData
  );
  response.setHeader("content-type", "text/html");
  response.end(html);
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
  update(posts, asRecords(posts.urlPrefix));

  // Persistent storage
  saveAuthor(request.author);

  // Acknowledge post(s) appended
  send(response, { success: true });
});
