import { Resource, update } from "./resource";
import { send, error } from "./utils";
import { Router } from "express";

export const router = new Router();

export type Like = {
  $link: string;
  weight: number;
}

export function makeLikes(urlPrefix): Resource<Array<Like>> {
  return {
    version: 0,
    subscriptions: new Set(),
    value: [],
    urlPrefix
  };
}

const asData = (prefix: string) => (likes: Array<Like>) => {
  return likes.map((like, i) => ({
    resource: `${prefix}/like/${i}`,
    like,
  }));
}

router.get("/", (request, response) => {
  const likes = request.author.likes;
  const likesData = asData(likes.urlPrefix)(likes.value);
  if (request.subscribe) {
    response.startSubscription();
    response.sendVersion({
      version: likes.version,
      body: JSON.stringify(likesData),
    });
    likes.subscriptions.add(response);
  } else {
    send(response, likesData);
  }
});

router.put("/", async (request, response) => {
  const likes = request.author.likes;
  const patches = await request.patches();
  if (patches.length > 0) {
    // Possibly more than one thing can be appended
    for (const patch of patches) {
      // We only accept appending via 'json' content-range type
      if (patch.unit === "json" && patch.range === "[-0:-0]") {
        const { title, body } = JSON.parse(patch.content);
        likes.value.push({ title, body });
      } else {
        error(response, "only appending to likes is supported");
        return;
      }
    }
  } else {
    error(response, "patch required");
  }

  // Increment version & send an update to any subscribers
  update(likes, asData(likes.urlPrefix));

  // Acknowledge like(s) appended
  send(response, { success: true });
});
