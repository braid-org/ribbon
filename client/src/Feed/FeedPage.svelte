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
  <PostList posts={likes} />
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

  span {
    padding-left: 16px;
  }
  .error {
    color: var(--cherry);
  }
</style>
