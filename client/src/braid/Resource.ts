import { get, writable, Writable } from "svelte/store";
import { braid_fetch } from "./braid-client";
import { config } from "../Settings/config";

type ConnectionState = "init" | "connected" | "disconnected" | "error";

// There is only one Resource per URL, so we create an in-memory cache
// of resources. This gives us flexibility when multiple links point
// to the same resource, or when a link is removed and re-created but
// still points to the same resource (the resource itself does not
// need to be destroyed when a link is destroyed).
const resources: Map<string, Resource<any>> = new Map();

function getOrCreateResource<T>(url: URL) {
  if (resources.has(url.href)) {
    return resources.get(url.href);
  } else {
    const resource = new Resource(url);
    resources.set(url.href, resource);
    return resource;
  }
}

// Return a new JSON datatype, replacing $link with a Resource
function linkedJSON<T>(json: any, baseUrl: string) {
  if (json instanceof Array) {
    return json.map((item) => linkedJSON(item, baseUrl));
  } else if (json instanceof Object) {
    if (json.$link) {
      return getOrCreateResource(new URL(json.$link, baseUrl));
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
    const cancel = braid_fetch(
      url,
      { subscribe: { keep_alive: true } },
      (response) => {
        // console.log("braid_fetch response", response);
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
    this.cancel = () => {
      // console.log("cancel braid_fetch", url.href);
      cancel();
    };
  }

  setRaw(jsonValue: string) {
    this.setJson(JSON.parse(jsonValue));
  }

  setJson(value) {
    const baseUrl: string = get(config.serverUrl);
    const maybeLinkedJSON = linkedJSON(value, baseUrl);
    // console.log("setJson", this.url.href, value, "linked:", maybeLinkedJSON);
    this.store.set(maybeLinkedJSON);
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
