<script>
  import { onMount } from "svelte";

  import { ArrayResource } from "./braid";

  import Background from "./Background.svelte";
  import Sidebar from "./Sidebar.svelte";

  import LoginPage from "./Login/LoginPage.svelte";
  import ChatPage from "./Chat/ChatPage.svelte";

  import SettingsPage from "./Settings/SettingsPage.svelte";
  import { author, notify, serverUrl } from "./config";

  import { getHashParams } from "./utils/getHashParams";

  let authors, messages;

  let seen = 0;

  function updateSeen() {
    seen = messages.length;
  }

  function handleNotify(messages) {
    messages.subscribe((msgs) => {
      if (document.hasFocus()) {
        updateSeen();
      } else if ($notify && msgs.length > seen) {
        const count = msgs.length - seen;
        const noti = new Notification(
          `${count} new message${count === 1 ? "" : "s"}`
        );
        noti.addEventListener("click", () => {
          page = "chat";
          updateSeen();
        });
      }
    });
  }

  function onChangeFocus(event) {
    const hasFocus = document.hasFocus();
    if (hasFocus) updateSeen();
  }

  $: {
    if (authors) authors.cancel();
    const url = $serverUrl + "/authors";
    authors = new ArrayResource(url);
  }

  $: {
    if (messages) messages.cancel();
    const url = $serverUrl + "/messages";
    messages = new ArrayResource(url);
    handleNotify(messages);
  }

  let page = "login";
  $: {
    if ($author) page = "chat";
  }

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

<svelte:window
  on:hashchange={handleHashParams}
  on:blur={onChangeFocus}
  on:focus={onChangeFocus}
/>

<style>
  app {
    display: block;
    margin-left: 160px;
    height: 100vh;
  }
  @media only screen and (max-width: 600px) {
    app {
      margin-left: 0;
      padding-top: 80px;
      height: calc(100vh - 72px);
    }
  }
</style>
