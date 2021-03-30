import { Router } from "express";
import { fetch } from "braidify";

import { Resource, update } from "./resource";
import { send, error } from "./utils";
import { Post } from "./makePosts";
import { FeedItem } from "./makeFeed";
import { Like, asRecords } from "./makeLikes";
import { saveAuthor } from "./persistence";

export const router = new Router();

function addRecordToFeed(
  { resource, post }: { resource: string; post: Post },
  feed: Resource<Array<FeedItem>>
) {
  if (!feed.value.find((item) => item.resource === resource)) {
    feed.value.push({ resource, post });
  }
}

export function addLikeToFeed(like: Like, feed: Resource<Array<FeedItem>>) {
  fetch(like.$link, {
    subscribe: { keep_alive: true },
  }).andThen((version) => {
    if (version.body) {
      const records = JSON.parse(version.body);

      /**
       * We must decide heuristically here what to do with the thing that was 'liked':
       * - if it's a list of posts, we can iterate and add them
       * - if it's an individual post, just add it
       * */
      if (records instanceof Array) {
        for (const record of records) {
          addRecordToFeed(record, feed);
        }
      } else {
        addRecordToFeed(records /* individual record */, feed);
      }
      // Tell subscribers the feed has changed
      update(feed);
    } else if (version.patches) {
      throw new Error("patches not yet supported");
    }
  });
}

router.get("/likes", getLikes);
export function getLikes(request, response) {
  const likes = request.author.likes;
  const likesData = asRecords(likes.urlPrefix)(likes.value);
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
}

router.put("/likes", putLike);
export async function putLike(request, response) {
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
  update(likes, asRecords(likes.urlPrefix));

  // Persistent storage
  saveAuthor(request.author);

  // Acknowledge like(s) appended
  send(response, { success: true });
}
