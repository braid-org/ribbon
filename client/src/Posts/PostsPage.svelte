<script>
  import { slide } from "svelte/transition";
  import NewPost from "./NewPost.svelte";
  import PostList from "./PostList.svelte";
  import NewPostButton from "./NewPostButton.svelte";
  import { serverUrl } from "../Settings/config";

  export let records; // : Resource<Array<any>>

  let connectState;
  $: connectState = records.connectState;

  let newPostVisible = false;

  async function onPost({ detail }) {
    const { title, body } = detail;
    records.append({ title, body });
    // TODO: optimize by creating locally first, then skipping
    // when server tells us it exists (instead of waiting for
    // the server to tell us what we already know)
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
  <PostList {records} />
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
