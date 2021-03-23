import { derived } from "svelte/store";
import { writable } from "svelte-local-storage-store";

const DEFAULT_URL = window.ribbon_config.origin;

export const author = writable("author", "default");
export const serverUrl = writable("serverUrl", DEFAULT_URL);
export const customAuthorUrl = writable("customAuthorUrl", null);
export const authorUrl = derived(
  [serverUrl, author, customAuthorUrl],
  ([$serverUrl, $author, $customAuthorUrl], set) => {
    if ($customAuthorUrl) {
      set($customAuthorUrl);
    } else {
      set(`${$serverUrl}/author/${$author}`);
    }
  }
);

authorUrl.subscribe(($authorUrl) => {
  console.log("authorUrl", $authorUrl);
});
