import { InitialResource, Resource } from "./resource";

export type Like = {
  $link: string;
  weight: number;
};

export function makeLikes(
  initial: InitialResource<Array<Like>> = {},
  urlPrefix: string
): Resource<Array<Like>> {
  return {
    version: initial.version || 0,
    value: initial.value ? [...initial.value] : [],
    urlPrefix: initial.urlPrefix || urlPrefix,
    subscriptions: new Set(),
  };
}

export const asRecords = (prefix: string) => (likes: Array<Like>) => {
  return likes.map((like, i) => ({
    resource: `${prefix}/like/${i}`,
    like,
  }));
};
