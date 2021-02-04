<script>
  import Post from "./Post.svelte";
  import Background from "./Background.svelte";
  import { writable } from "svelte/store";
  import { ArrayResource } from "./braid";

  const posts = writable([]);

  const url = new URL("/", "http://localhost:3000");
  new ArrayResource(url, posts);
</script>

<Background />

<content>
  {#each $posts as post}
    <Post title={post.title} body={post.body} />
  {/each}
</content>

<style>
  content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 48px;
  }
</style>
