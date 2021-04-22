import { Router } from "express";

import { origin } from "./config";
import { append, Resource } from "./resource";
import { send, error } from "./utils";

export const router = new Router();

type Message = {
  body: string;
  author: string;
  timestamp: number;
};

const messages: Resource<Array<Message>> = {
  value: [],
  version: 0,
  subscriptions: new Set(),
  urlPrefix: origin,
};

router.get("/messages", getMessages);
export function getMessages(request, response) {
  if (request.subscribe) {
    response.startSubscription();
    response.sendVersion({
      version: messages.version,
      body: JSON.stringify(messages.value),
    });
    messages.subscriptions.add(response);
  } else {
    send(response, messages.value);
  }
}

router.put("/messages", putMessage);
export async function putMessage(request, response) {
  const patches = await request.patches();
  if (patches.length > 0) {
    // Possibly more than one thing can be appended
    for (const patch of patches) {
      // We only accept appending via 'json' content-range type
      if (patch.unit === "json" && patch.range === "[-0:-0]") {
        const { author, body } = JSON.parse(patch.content);
        if (author && body) {
          // Increment version & send an update to any subscribers
          append(messages, {
            author,
            body,
            timestamp: Math.floor(new Date().getTime() / 1000),
          });
        } else {
          error(response, "author and message body required");
          return;
        }
      } else {
        error(response, "only appending to posts is supported");
        return;
      }
    }
  } else {
    error(response, "patch required");
  }

  // Acknowledge post(s) appended
  send(response, { success: true });
}
