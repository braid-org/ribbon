import { writable } from "svelte-local-storage-store";

const DEFAULT_URL = import.meta.env["SNOWPACK_PUBLIC_URL"];

const serverUrl = writable(
  "serverUrl",
  DEFAULT_URL || "https://invisible.college:4545"
);

export const config = {
  serverUrl,
};
