import { get, writable, Writable } from "svelte/store";
import { braid_fetch } from "./braid-client";
import { config } from "../Settings/config";

type ConnectionState = "init" | "connected" | "disconnected" | "error";

// Return a new JSON datatype, replacing $link with a Resource
function linkedJSON(json: any, baseUrl: string) {
  if (json instanceof Array) {
    return json.map((item) => linkedJSON(item, baseUrl));
  } else if (json instanceof Object) {
    if (json.$link) {
      return new Resource(new URL(json.$link, baseUrl));
    } else {
      const record = {};
      for (const [key, value] of Object.entries(json)) {
        record[key] = linkedJSON(value, baseUrl);
      }
      return record;
    }
  } else {
    return json;
  }
}

export class Resource<T> {
  version: number;
  url: URL;
  store: Writable<T>;
  connectState: Writable<ConnectionState>;
  state: ConnectionState;
  cancel: Function;

  constructor(url: URL, initialValue: T = null) {
    this.version = 0;
    this.url = url;
    this.store = writable(initialValue);
    this.connectState = writable("init");
    this.connectState.subscribe((state) => {
      this.state = state;
    });

    console.log("braid_fetch", url);
    this.cancel = braid_fetch(
      url,
      { subscribe: { keep_alive: true } },
      (response) => {
        console.log("braid_fetch response", response);
        this.version = response.version;
        this.connectState.set("connected");

        // When we receive updates, they might come in the form of patches:
        if (response.patches) {
          this.applyPatches(response.patches);
        } else {
          this.setRaw(response.body);
        }
      },
      () => {
        this.connectState.set("error");
      }
    );
  }

  setRaw(jsonValue: string) {
    this.setJson(JSON.parse(jsonValue));
  }

  setJson(value) {
    const baseUrl: string = get(config.serverUrl);
    this.store.set(linkedJSON(value, baseUrl));
  }

  applyPatches(patches) {
    for (var patch of patches) {
      // assume the patch replaces the resource
      // TODO: smarter logic around patch ranges--e.g. change just the title
      if (patch.range === "") {
        this.setRaw(patch.value);
      } else {
        console.warn(`Can't apply patch; range unsupported`, patch.range);
      }
    }
  }

  subscribe(handler) {
    return this.store.subscribe(handler);
  }
}
