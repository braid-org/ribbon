<script>
  import { slide } from "svelte/transition";
  import PostList from "../Posts/PostList.svelte";
  import { config } from "../Settings/config";

  let serverUrl = config.serverUrl;

  export let likes; // : Resource<Array<any>>

  let connectState;
  $: connectState = likes.connectState;

  function flattenLikes(list) {
    return list;
  }
</script>

{#if $connectState === "connected"}
  {#if $likes.length === 0}
    <h1>Empty Feed</h1>
    <h2>Try 'Liking' a Post and it'll show up here</h2>
  {:else}
    <PostList posts={likes} />
  {/if}
{:else if $connectState === "init"}
  <status transition:slide> Loading... </status>
{:else}
  <status>
    Not connected: <span class:error={$connectState === "error"}
      >{$connectState}</span
    >
  </status>
{/if}

<style>
  status {
    display: flex;
    justify-content: center;

    color: white;
    font-size: 28px;
    font-weight: 700;
    margin-top: 64px;
  }

  h1,
  h2 {
    text-align: center;
  }
  h1 {
    margin-top: 48px;
    color: white;
    font-size: 32px;
  }
  h2 {
    color: #e0e0e0;
    font-size: 24px;
    font-weight: normal;
  }
  span {
    padding-left: 16px;
  }
  .error {
    color: var(--cherry);
  }
</style>
