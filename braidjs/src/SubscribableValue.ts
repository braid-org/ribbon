import { writable, WritableStore } from "./WritableStore";
import { braidStream, BraidStream } from "./server";

export class SubscribableValue<T> {
  store: WritableStore<T>;
  nextStreamId: number;
  streams: Record<number, BraidStream>;

  constructor(initialValue: T) {
    this.store = writable(initialValue);
    this.nextStreamId = 1;
    this.streams = {};

    this.connectStoreToStreams();
  }

  connectStoreToStreams() {
    this.store.subscribe((value) => {
      for (const stream of Object.values(this.streams)) {
        const currentValue = JSON.stringify(value);
        stream.append(currentValue);
      }
    });
  }

  addStream(res, initialValue) {
    const streamId = this.nextStreamId++;
    this.streams[streamId] = braidStream(res, {
      initialValue,
      contentType: "application/json",
      onclose: () => {
        if (!streamId) throw new Error("null streamId");
        if (this.streams[streamId]) {
          delete this.streams[streamId];
        } else {
          console.warn("couldn't delete stream", streamId, this.streams);
        }
      },
    });
  }

  respond(req, res) {
    const currentValue = JSON.stringify(this.store.get());

    if (req.headers.subscribe === "keep-alive") {
      this.addStream(res, currentValue);
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(currentValue);
    }
  }
}
