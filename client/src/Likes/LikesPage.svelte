<script>
  import { slide } from "svelte/transition";
  import NewLike from "./NewLike.svelte";
  import NewLikeButton from "./NewLikeButton.svelte";
  import LikeList from "./LikeList.svelte";
  import { config } from "../Settings/config";

  let serverUrl = config.serverUrl;

  export let likes; // : Resource<Array<any>>

  let connectState;
  $: connectState = likes.connectState;

  let newLikeVisible = $likes.length === 0;
  function onLike({ details }) {
    console.log("like", details);
  }
</script>

<NewLikeButton bind:visible={newLikeVisible} />

{#if newLikeVisible}
  <div transition:slide>
    <NewLike on:like={onLike} />
  </div>
{/if}

{#if $connectState === "connected"}
  <LikeList {likes} />
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
