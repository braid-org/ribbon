import { Resource } from "./resource";
import { Post } from "./posts";
import { send, error } from "./utils";
import { Router } from "express";

export const router = new Router();

export type FeedItem = {
  resource: string;
  post: Post;
};

export function makeFeed(urlPrefix): Resource<Array<FeedItem>> {
  return {
    version: 0,
    subscriptions: new Set(),
    value: [],
    urlPrefix,
  };
}

router.get("/feed", (request, response) => {
  const feed = request.author.feed;
  const feedData = feed.value;
  if (request.subscribe) {
    response.startSubscription();
    response.sendVersion({
      version: feed.version,
      body: JSON.stringify(feedData),
    });
    feed.subscriptions.add(response);
  } else {
    send(response, feedData);
  }
});
