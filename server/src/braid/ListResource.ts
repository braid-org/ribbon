import { Resource, GetUrl, ServerResponsePlusBraid } from "./Resource";

export class ListResource<T> extends Resource<Array<T>> {
  constructor(getUrl: GetUrl<Array<T>>, list: Array<T> = []) {
    super(getUrl, list);
  }

  push(value: T) {
    this.store.update((state) => [...state, value]);
  }

  get length(): number {
    return this.store.get().length;
  }

  get(i: number): T {
    return this.store.get()[i];
  }

  setAtIndex(index: number, value: T) {
    this.store.update((state) => [
      ...state.slice(0, index),
      value,
      ...state.slice(index + 1, state.length + 1),
    ]);
  }

  async patch(req, response: ServerResponsePlusBraid) {
    var patches = await req.patches();

    if (patches.length === 1 && patches[0].range === "[-0:-0]") {
      const item: T = JSON.parse(patches[0].content);
      this.push(item);
      response.statusCode = 200;
      response.end();
    } else {
      response.statusCode = 400;
      response.end("Only one patch, constrained to range [-0:-0] accepted");
    }
  }
}
