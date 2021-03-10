import { Resource } from "./resource";
import { Post } from "./posts";
import { send, error } from "./utils";
import { Router } from "express";

export const router = new Router();

export function makeFeed(urlPrefix): Resource<Array<Post>> {
  return {
    version: 0,
    subscriptions: new Set(),
    value: [],
    urlPrefix,
  };
}

router.get("/", (request, response) => {
  const feed = request.author.feed;
  // const likesData = asData(likes.value, likes.urlPrefix);
  const feedData = []
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
