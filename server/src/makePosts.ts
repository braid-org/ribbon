import { InitialResource, Resource } from "./resource";

export type Post = {
  title?: string;
  body?: string;
};

export function makePosts(
  initial: InitialResource<Array<Post>> = {},
  urlPrefix?: string
): Resource<Array<Post>> {
  return {
    version: initial.version || 0,
    value: initial.value ? [...initial.value] : [],
    urlPrefix: initial.urlPrefix || urlPrefix,
    subscriptions: new Set(),
  };
}

export const asRecords = (prefix: string) => (posts: Array<Post>) => {
  return posts.map((post, i) => ({
    resource: `${prefix}/post/${i}`,
    post,
  }));
};
