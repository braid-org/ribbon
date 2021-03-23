import { origin, populateInitialPosts } from "./config";
import { Resource } from "./resource";
import { makePosts, Post } from "./posts";
import { makeLikes, addLikeToFeed, Like } from "./likes";
import { FeedItem, makeFeed } from "./feed";
import { initialDefaultPosts, initialFriendPosts } from "./initialPosts";

export type Author = {
  shortname: string;
  posts: Resource<Array<Post>>;
  likes: Resource<Array<Like>>;
  feed: Resource<Array<FeedItem>>;
};

function makeAuthor(shortname, initialPosts = []) {
  const prefix = `${origin}/author/${shortname}`;
  const posts = makePosts(prefix, initialPosts);
  const likes = makeLikes(prefix);
  const feed = makeFeed(prefix);

  // An author 'likes' his or her own posts by default
  const likeMyself = { $link: `${prefix}/posts`, weight: 1 };
  likes.value.push(likeMyself);
  addLikeToFeed(likeMyself, feed);

  return { shortname, posts, likes, feed };
}

export const authors: Resource<Record<string, Author>> = {
  version: 0,
  subscriptions: new Set(),
  value: {
    // Keys are author shortnames; we create a 'default' author
    default: makeAuthor(
      "default",
      populateInitialPosts ? initialDefaultPosts : []
    ),
    friend: makeAuthor(
      "friend",
      populateInitialPosts ? initialFriendPosts : []
    ),
  },
  urlPrefix: origin,
};
