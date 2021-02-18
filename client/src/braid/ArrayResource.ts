import { braid_put } from "./braid-client";
import { Resource } from "./Resource";

export class ArrayResource<T> extends Resource<Array<T>> {
  constructor(url: URL) {
    super(url, []);
  }

  append(value: T) {
    this.store.update((items) => {
      return [...items, value];
    });
    braid_put(this.url, {
      patches: [{ range: "[-0:-0]", value: JSON.stringify(value) }],
    });
  }
}
