import { Resource } from "./Resource";

export class Link<T> {
  pointer: Resource<T>;

  constructor(pointer: Resource<T>) {
    this.pointer = pointer;
  }

  toJSON() {
    return { $link: this.pointer.url };
  }
}
