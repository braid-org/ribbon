import { origin, populateInitialPosts } from "./config";
import { Resource, update } from "./resource";
import { makePosts, Post } from "./posts";
import { makeLikes, addLikeToFeed, Like } from "./likes";
import { FeedItem, makeFeed } from "./feed";
import { initialDefaultPosts, initialFriendPosts } from "./initialPosts";
import { send, error } from "./utils";
import { Router } from "express";

export const router = new Router();

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

const asRecords = (prefix: string) => (authors: Record<string, Author>) => {
  return Object.keys(authors).map((shortname) => ({
    resource: `${prefix}/author/${shortname}`,
    shortname,
    posts: { $link: `${prefix}/author/${shortname}/posts` },
    likes: { $link: `${prefix}/author/${shortname}/likes` },
    feed: { $link: `${prefix}/author/${shortname}/feed` },
  }));
};

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

router.get("/author/:shortname", (request, response) => {
  const author = authors.value[request.params.shortname];

  if (author) {
    response.end(
      JSON.stringify({
        shortname: author.shortname,
        posts: author.posts.value,
        likes: author.likes.value,
      })
    );
  } else {
    error(response, "author not found", 404);
  }
});

router.get("/authors", (request, response) => {
  const authorsData = asRecords(origin)(authors.value);
  if (request.subscribe) {
    response.startSubscription();
    response.sendVersion({
      version: authors.version,
      body: JSON.stringify(authorsData),
    });
    authors.subscriptions.add(response);
  } else {
    send(response, authorsData);
  }
});

router.put("/authors", async (request, response) => {
  const patches = await request.patches();
  if (patches.length > 0) {
    // Possibly more than one thing can be appended
    for (const patch of patches) {
      // We only accept appending via 'json' content-range type
      if (patch.unit === "json" && patch.range === "[-0:-0]") {
        const { shortname } = JSON.parse(patch.content);
        if (shortname in authors.value) {
          error(response, "author already exists");
        } else if (shortname.length <= 1) {
          error(response, "author's shortname must be 2 or more characters");
        } else {
          authors.value[shortname] = makeAuthor(shortname);

          // Increment version & send an update to any subscribers
          update(authors, asRecords(origin));

          // Acknowledge author(s) appended
          send(response, { success: true });
        }
      } else {
        error(response, "only appending is supported");
      }
    }
  } else {
    error(response, "patch required");
  }
});
