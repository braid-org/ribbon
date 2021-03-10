import { origin } from "./config";
import { Resource, update } from "./resource";
import { makePosts, Post } from "./posts";
import { makeLikes, Like } from "./likes";
import { makeFeed } from "./feed";

type Author = {
  shortname: string;
  posts: Resource<Array<Post>>;
  likes: Resource<Array<Like>>;
  feed: Resource<Array<Post>>;
};

function makeAuthor(shortname) {
  const prefix = `${origin}/author/${shortname}`;
  const posts = makePosts(prefix);
  const likes = makeLikes(prefix);
  const feed = makeFeed(prefix);
  // An author 'likes' his or her own posts by default
  likes.value.push({ $link: `${prefix}/posts`, weight: 1 });
  return {
    shortname,
    posts,
    likes,
    feed,
  };
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

// TODO
// function asData(authors: Record<string, Author>, prefix = origin) {
// }
