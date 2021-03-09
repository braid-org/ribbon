export type Post = {
  title?: string;
  body?: string;
};

export const initialPosts: Record<string, Post> = {
  "0": {
    title: "A microblog you own",
    body:
      `Braid isn't satisfied to be yet another proprietary platform ` +
      `or protocol. We're working with the IETF to augment the HTTP ` +
      `standard so that subscribing and collaborating is native to the web.`,
  },
  "1": {
    body:
      `Share your life, and share how you see life. This microblog ` +
      `lets you create and share attention functions--find the signal ` +
      `without being subject to someone else's algorithm.`,
  },
  "2": { title: "Welcome to\nThe Braid." },
  "3": { title: "hello." },
};
