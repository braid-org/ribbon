<script>
  import { slide } from "svelte/transition";
  import NewPost from "./NewPost.svelte";
  import PostList from "./PostList.svelte";
  import NewPostButton from "./NewPostButton.svelte";

  export let resource;

  let connectState;
  $: connectState = resource.connectState;

  let newPostVisible = false;

  function onPost({ detail }) {
    const { title, body } = detail;
    resource.append({ title, body });
    newPostVisible = false;
  }
</script>

<NewPostButton bind:visible={newPostVisible} />

{#if newPostVisible}
  <div transition:slide>
    <NewPost on:post={onPost} />
  </div>
{/if}

{#if $connectState === "connected"}
  <PostList {resource} />
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
