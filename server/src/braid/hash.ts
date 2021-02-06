import { createHash } from "crypto";

export function hash(...values) {
  const hasher = createHash("sha256");
  hasher.update(JSON.stringify(values));
  return hasher.digest("base64").slice(0, 16);
}
