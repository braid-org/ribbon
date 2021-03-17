import { get } from "svelte/store";
import { writable } from "svelte-local-storage-store";

const DEFAULT_URL = "https://localhost:3000/author/default";

export const serverUrl = writable("serverUrl", DEFAULT_URL);

console.log("import.meta.env", import.meta.env);

console.log("serverUrl", get(serverUrl));

