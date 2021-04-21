<script>
  import { onMount } from "svelte";

  import { ArrayResource } from "./braid";

  import Background from "./Background.svelte";
  import Sidebar from "./Sidebar.svelte";

  import LoginPage from "./Login/LoginPage.svelte";
  import ChatPage from "./Chat/ChatPage.svelte";

  import SettingsPage from "./Settings/SettingsPage.svelte";
  import { author, serverUrl } from "./config";

  import { getHashParams } from "./utils/getHashParams";

  let authors, messages;

  $: {
    if (authors) authors.cancel();
    const url = $serverUrl + "/authors";
    authors = new ArrayResource(url);
  }

  $: {
    if (messages) messages.cancel();
    const url = $serverUrl + "/messages";
    messages = new ArrayResource(url);
  }

  let page = "login";

  function handleHashParams(event) {
    const params = getHashParams();
    if (params.author) {
      $author = params.author;
    }
  }

  onMount(handleHashParams);
</script>

<Background />

{#if page === "login"}
  <LoginPage {authors} on:done={() => (page = "chat")} />
{:else}
  <Sidebar bind:page />
  <app>
    {#if page === "settings"}
      <SettingsPage {authors} on:done={() => (page = "chat")} />
    {:else}
      <ChatPage {messages} me={$author} />
    {/if}
  </app>
{/if}

<svelte:window on:hashchange={handleHashParams} />

<style>
  app {
    display: block;
    margin-left: 160px;
    height: 100%;
  }
  @media only screen and (max-width: 600px) {
    app {
      margin-left: 0;
      margin-top: 88px;
    }
  }
</style>
