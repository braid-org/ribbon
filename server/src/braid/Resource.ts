import { ServerResponse } from "http";

import { writable, WritableStore } from "./WritableStore";
import { hash } from "./hash";

type BraidResponse = {
  startSubscription: Function;
  sendVersion: Function;
};

type ServerResponsePlusBraid = ServerResponse & BraidResponse;

export class Resource<T> {
  version: number;
  store: WritableStore<T>;
  subscriptions: Record<string, ServerResponsePlusBraid>;

  constructor(initialValue: T) {
    this.version = 0;
    this.store = writable(initialValue);
    this.subscriptions = {};

    this.connectStoreToSubscriptions();
  }

  connectStoreToSubscriptions() {
    // Subscribe to each change to the store
    this.store.subscribe((value) => {
      // A change means the store holds a new version
      this.version++;

      for (const response of Object.values(this.subscriptions)) {
        this.sendValue(response, this.version, value);
      }
    });
  }

  addSubscription(subId: string, response: ServerResponsePlusBraid) {
    response.startSubscription({
      onClose: () => delete this.subscriptions[subId],
    });
    this.subscriptions[subId] = response;
  }

  sendValue(response: ServerResponsePlusBraid, version: number, value: T) {
    response.sendVersion({
      version,
      body: JSON.stringify(value),
    });
  }

  get(req, response: ServerResponsePlusBraid) {
    const currentValue = this.store.get();

    response.setHeader("content-type", "application/json");

    if (req.subscribe) {
      const subscriptionId = hash(req.headers.client, req.url);

      // Continue to send updated values
      this.addSubscription(subscriptionId, response);

      // Send initial value
      this.sendValue(response, this.version, currentValue);
    } else {
      response.statusCode = 200;
      response.end(JSON.stringify(currentValue));
    }
  }
}

export class ListResource<T> extends Resource<Array<T>> {
  constructor(list: Array<T> = []) {
    super(list);
  }

  async patch(req, response: ServerResponsePlusBraid) {
    var patches = await req.patches();

    if (patches.length === 1 && patches[0].range === "[-0:-0]") {
      this.store.set((state) => [...state, JSON.parse(patches[0].content)]);
      response.statusCode = 200;
      response.end();
    } else {
      response.statusCode = 400;
      response.end("Only one patch, constrained to range [-0:-0] accepted");
    }
  }
}
