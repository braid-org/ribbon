import { fetch } from "braidify";
import { Resource } from "./Resource";

export class ArrayResource<T> extends Resource<Array<T>> {
  constructor(url: URL) {
    super(url, []);
  }

  append(value: T) {
    this.store.update((items) => {
      return [...items, value];
    });
    fetch(this.url, {
      method: "PUT",
      patches: [{ range: "[-0:-0]", value: JSON.stringify(value) }],
    });
  }
}
