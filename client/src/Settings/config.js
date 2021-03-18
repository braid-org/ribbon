import { get, derived } from "svelte/store";
import { writable } from "svelte-local-storage-store";

const DEFAULT_URL = "https://localhost:3000";

export const author = writable("author", "default");
export const serverUrl = writable("serverUrl", DEFAULT_URL);
export const customAuthorUrl = writable("customAuthorUrl", null);
export const authorUrl = derived(
  [serverUrl, author, customAuthorUrl],
  ([$serverUrl, $author, $customAuthorUrl], set) => {
    if ($customAuthorUrl) {
      set($customAuthorUrl)
    } else {
      set(`${$serverUrl}/author/${$author}`);
    }
  }
);

console.log("import.meta.env", import.meta.env);

authorUrl.subscribe($authorUrl => {
  console.log("authorUrl", $authorUrl);
})
