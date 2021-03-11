import { get } from "svelte/store";
import { writable } from "svelte-local-storage-store";

const DEFAULT_URL =
  import.meta.env["SNOWPACK_PUBLIC_URL"] || "https://invisible.college:4545";

export const serverUrl = writable("serverUrl", DEFAULT_URL);

console.log("import.meta.env", import.meta.env);

console.log("serverUrl", get(serverUrl));

