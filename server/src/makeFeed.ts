import { InitialResource, Resource } from "./resource";
import { Post } from "./makePosts";

export type FeedItem = {
  resource: string;
  post: Post;
};

export function makeFeed(
  initial: InitialResource<Array<FeedItem>> = {},
  urlPrefix
): Resource<Array<FeedItem>> {
  return {
    version: initial.version || 0,
    value: initial.value ? [...initial.value] : [],
    urlPrefix: initial.urlPrefix || urlPrefix,
    subscriptions: new Set(),
  };
}
