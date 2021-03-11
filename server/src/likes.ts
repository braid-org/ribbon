import { Resource, update } from "./resource";
import { send, error } from "./utils";
import { Router } from "express";
import { FeedItem } from "./feed";
import { fetch } from "braidify";

export const router = new Router();

export type Like = {
  $link: string;
  weight: number;
};

export function makeLikes(urlPrefix): Resource<Array<Like>> {
  return {
    version: 0,
    subscriptions: new Set(),
    value: [],
    urlPrefix,
  };
}

const asData = (prefix: string) => (likes: Array<Like>) => {
  return likes.map((like, i) => ({
    resource: `${prefix}/like/${i}`,
    like,
  }));
};

export function addLikeToFeed(like: Like, feed: Resource<Array<FeedItem>>) {
  fetch(like.$link, {
    subscribe: { keep_alive: true },
  }).andThen((version) => {
    if (version.body) {
      const records = JSON.parse(version.body);
      for (const { resource, post } of records) {
        if (!feed.value.find((item) => item.resource === resource)) {
          feed.value.push({ resource, post });
        }
      }
      // Tell subscribers the feed has changed
      update(feed);
    } else if (version.patches) {
      throw new Error("patches not yet supported");
    }
  });
}

router.get("/", (request, response) => {
  const likes = request.author.likes;
  const likesData = asData(likes.urlPrefix)(likes.value);
  if (request.subscribe) {
    response.startSubscription();
    response.sendVersion({
      version: likes.version,
      body: JSON.stringify(likesData),
    });
    likes.subscriptions.add(response);
  } else {
    send(response, likesData);
  }
});

router.put("/", async (request, response) => {
  const likes = request.author.likes;
  const patches = await request.patches();
  if (patches.length > 0) {
    // Possibly more than one thing can be appended
    for (const patch of patches) {
      // We only accept appending via 'json' content-range type
      if (patch.unit === "json" && patch.range === "[-0:-0]") {
        const like: Like = JSON.parse(patch.content);
        if (like.$link) {
          likes.value.push(like);
          addLikeToFeed(like, request.author.feed);
        }
      } else {
        error(response, "only appending to likes is supported");
        return;
      }
    }
  } else {
    error(response, "patch required");
  }

  // Increment version & send an update to any subscribers
  update(likes, asData(likes.urlPrefix));

  // Acknowledge like(s) appended
  send(response, { success: true });
});
