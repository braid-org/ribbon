import * as highwayhash from "highwayhash";
import { randomBytes } from "crypto";

// NOTE: This should be a config setting if we want to store hashes across instantiations
const ephemeralKey = randomBytes(32);

export function hash(...values) {
  return highwayhash
    .asBuffer(ephemeralKey, Buffer.from(JSON.stringify(values)))
    .toString("base64")
    .slice(0, -1);
}
