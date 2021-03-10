import { origin } from "./config";
import { Resource, update } from "./resource";
import { makePosts, Post } from "./posts";
import { makeLikes, Like } from "./likes";
import { FeedItem, makeFeed } from "./feed";
import { fetch } from "braidify";

type Author = {
  shortname: string;
  posts: Resource<Array<Post>>;
  likes: Resource<Array<Like>>;
  feed: Resource<Array<FeedItem>>;
};

function addLikeToFeed(like: Like, feed: Resource<Array<FeedItem>>) {
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
      throw new Error("patches not supported");
    }
  });
}

function makeAuthor(shortname) {
  const prefix = `${origin}/author/${shortname}`;
  const posts = makePosts(prefix);
  const likes = makeLikes(prefix);
  const feed = makeFeed(prefix);

  // An author 'likes' his or her own posts by default
  const likeMyself = { $link: `${prefix}/posts`, weight: 1 };
  likes.value.push(likeMyself);
  setTimeout(() => addLikeToFeed(likeMyself, feed), 3000);

  return { shortname, posts, likes, feed };
}

export const authors: Resource<Record<string, Author>> = {
  version: 0,
  subscriptions: new Set(),
  value: {
    // Keys are author shortnames; we create a 'default' author
    default: makeAuthor("default"),
  },
  urlPrefix: origin,
};
