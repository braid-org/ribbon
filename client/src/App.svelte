<script>
  import { writable } from "svelte/store";
  import { ArrayResource } from "./braid";

  import Background from "./Background.svelte";
  import PostsPage from "./Posts/PostsPage.svelte";
  import LikesPage from "./Likes/LikesPage.svelte";
  import Sidebar from "./Sidebar.svelte";

  const posts = new ArrayResource(
    new URL("/posts", "http://localhost:3000"),
    writable([])
  );

  const likes = new ArrayResource(
    new URL("/likes", "http://localhost:3000"),
    writable([])
  );

  let page = "posts";
</script>

<Background />

<Sidebar bind:page />

<app>
  {#if page === "posts"}
    <PostsPage resource={posts} />
  {:else if page === "likes"}
    <LikesPage resource={likes} />
  {/if}
</app>

<style>
  app {
    display: block;
    margin-left: 160px;
  }
</style>
