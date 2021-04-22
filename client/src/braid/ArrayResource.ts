import { fetch } from "braidify";
import { Resource } from "./Resource";

export class ArrayResource<T> extends Resource<Array<T>> {
  constructor(url: URL) {
    super(url, []);
  }

  applyPatches(patches) {
    for (var patch of patches) {
      if (patch.range === "") {
        this.setRaw(patch.content);
      } else if (patch.unit === "json" && patch.range === "[-0:-0]") {
        const parsed = this.parse(patch.content);
        if (parsed) {
          this.store.update((array) => {
            array.push(parsed);
            return array;
          });
        }
      } else {
        console.warn(`Can't apply patch; range unsupported`, patch);
      }
    }
  }

  append(value: T) {
    // this.store.update((items) => {
    //   return [...items, value];
    // });
    fetch(this.url, {
      method: "PUT",
      patches: [
        { unit: "json", range: "[-0:-0]", content: JSON.stringify(value) },
      ],
    });
  }
}
