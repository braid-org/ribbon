import { writable } from "svelte-local-storage-store";

export const config = {
  serverUrl: writable("serverUrl", "http://localhost:3000"),
};
