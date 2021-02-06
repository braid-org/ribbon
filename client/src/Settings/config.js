import { writable } from "svelte-local-storage-store";

export const config = {
  serverUrl: writable("serverUrl", "https://rphilosophy.com:3001"),
};
