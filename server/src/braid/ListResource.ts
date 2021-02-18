import { Resource, GetUrl, ServerResponsePlusBraid } from "./Resource";

export class ListResource<T> extends Resource<Array<T>> {
  constructor(getUrl: GetUrl<Array<T>>, list: Array<T> = []) {
    super(getUrl, list);
  }

  push(value: T) {
    this.value = [...this.value, value];
    this.change();
  }

  get length(): number {
    return this.value.length;
  }

  get(i: number): T {
    return this.value[i];
  }

  setAtIndex(index: number, value: T) {
    this.value[index] = value;
    this.change();
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
