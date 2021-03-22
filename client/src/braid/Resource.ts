import { writable, Writable } from "svelte/store";
import { fetch } from "braidify";

type ConnectionState = "init" | "connected" | "disconnected" | "error";

export class Resource<T> {
  version: number;
  url: URL;
  store: Writable<T>;
  connectState: Writable<ConnectionState>;
  state: ConnectionState;
  cancel: Function;
  isResource: boolean;

  constructor(url: URL, initialValue: T = null) {
    this.isResource = true;
    this.version = 0;
    this.url = url;
    this.store = writable(initialValue);
    this.connectState = writable("init");
    this.connectState.subscribe((state) => {
      this.state = state;
    });

    // console.log("braid_fetch", url.href);
    const abort = new AbortController();
    const cancel = fetch(url, {
      subscribe: { keep_alive: true },
      signal: abort.signal,
    })
      .andThen((response) => {
        this.version = response.version;
        this.connectState.set("connected");

        // When we receive updates, they might come in the form of patches:
        if (response.patches) {
          this.applyPatches(response.patches);
        } else {
          this.setRaw(response.body);
        }
      })
      .catch(() => {
        this.connectState.set("error");
      });

    this.cancel = () => {
      // console.log("cancel braid_fetch", url.href);
      // cancel();
      abort.abort();
    };
  }

  setRaw(jsonValue: string) {
    let parsed;
    try {
      parsed = JSON.parse(jsonValue);
    } catch (err) {
      throw new Error(`Unable to parse: ${jsonValue} (${err})`);
    }
    this.setJson(parsed);
  }

  setJson(value) {
    this.store.set(value);
  }

  applyPatches(patches) {
    for (var patch of patches) {
      // assume the patch replaces the resource
      // TODO: smarter logic around patch ranges--e.g. change just the title
      if (patch.range === "") {
        this.setRaw(patch.content);
      } else {
        console.warn(`Can't apply patch; range unsupported`, patch.range);
      }
    }
  }

  subscribe(handler) {
    return this.store.subscribe(handler);
  }
}
