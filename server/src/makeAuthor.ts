import { origin } from "./config";
import { InitialResource, Resource } from "./resource";
import { Post, makePosts } from "./makePosts";
import { Like, makeLikes } from "./makeLikes";
import { FeedItem, makeFeed } from "./makeFeed";
import { addLikeToFeed } from "./likes";

export type InitialAuthor = {
  shortname: string;
  posts?: InitialResource<Array<Post>>;
  likes?: InitialResource<Array<Like>>;
  feed?: InitialResource<Array<FeedItem>>;
};

export type Author = {
  shortname: string;
  posts: Resource<Array<Post>>;
  likes: Resource<Array<Like>>;
  feed: Resource<Array<FeedItem>>;
};

export function makeAuthor(initial: InitialAuthor): Author {
  const prefix = `${origin}/author/${initial.shortname}`;
  const posts = makePosts(initial.posts, prefix);
  const likes = makeLikes(initial.likes, prefix);
  const feed = makeFeed(initial.feed, prefix);

  if ((initial.likes?.value || []).length === 0) {
    // An author 'likes' his or her own posts by default
    const likeMyself = { $link: `${prefix}/posts`, weight: 1 };
    likes.value.push(likeMyself);
  }

  // Subscribed to Liked things
  likes.value.forEach((like) => {
    addLikeToFeed(like, feed);
  });

  return { shortname: initial.shortname, posts, likes, feed };
}

export const asRecords = (prefix: string) => (
  authors: Record<string, Author>
) => {
  return Object.keys(authors).map((shortname) => ({
    resource: `${prefix}/author/${shortname}`,
    shortname,
    posts: { $link: `${prefix}/author/${shortname}/posts` },
    likes: { $link: `${prefix}/author/${shortname}/likes` },
    feed: { $link: `${prefix}/author/${shortname}/feed` },
  }));
};
