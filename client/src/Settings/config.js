import { writable } from "svelte-local-storage-store";

export const config = {
  serverUrl: writable("serverUrl", "https://braid.rphilosophy.com"),
};
