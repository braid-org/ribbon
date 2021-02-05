<script>
  import { writable } from "svelte/store";
  import { ArrayResource } from "./braid";

  import Background from "./Background.svelte";
  import Sidebar from "./Sidebar.svelte";

  import PostsPage from "./Posts/PostsPage.svelte";
  import LikesPage from "./Likes/LikesPage.svelte";
  import SettingsPage from "./Settings/SettingsPage.svelte";

  import { config } from "./Settings/config";

  let posts, likes;
  let serverUrl = config.serverUrl;

  $: {
    if (posts) posts.cancel();
    posts = new ArrayResource(new URL("/posts", $serverUrl), writable([]));
  }

  $: {
    if (likes) likes.cancel();
    likes = new ArrayResource(new URL("/likes", $serverUrl), writable([]));
  }

  let page = "posts";
</script>

<Background />

<Sidebar bind:page />

<app>
  {#if page === "posts"}
    <PostsPage resource={posts} />
  {:else if page === "likes"}
    <LikesPage resource={likes} />
  {:else if page === "settings"}
    <SettingsPage on:done={() => (page = "posts")} />
  {/if}
</app>

<style>
  app {
    display: block;
    margin-left: 160px;
  }
</style>
