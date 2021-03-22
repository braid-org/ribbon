<script>
  import { slide } from "svelte/transition";
  import NewPost from "./NewPost.svelte";
  import PostList from "./PostList.svelte";
  import SpinToggleButton from "../components/SpinToggleButton.svelte";

  import { author } from "../Settings/config";
  import { capitalize } from "../utils/capitalize";
  import { possessive } from "../utils/possessive";

  export let records; // : Resource<Array<any>>

  let connectState;
  $: connectState = records.connectState;

  let newPostVisible = false;

  async function onPost({ detail }) {
    const { title, body } = detail;
    records.append({ title, body });
    newPostVisible = false;
  }
</script>

<page>
  <h1>
    {#if $author}{possessive(capitalize($author))} {/if}Posts
  </h1>
  
  <SpinToggleButton bind:visible={newPostVisible}>
    New Post
  </SpinToggleButton>

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
      Not connected:
      <span class:error={$connectState === "error"}>{$connectState}</span>
    </status>
  {/if}
</page>

<style>
  page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  status {
    display: flex;
    justify-content: center;

    color: white;
    font-size: 28px;
    font-weight: 700;
    margin-top: 64px;
  }
  h1 {
    font-size: 32px;
    color: white;
  }
  span {
    padding-left: 16px;
  }
  .error {
    color: var(--cherry);
  }
</style>
