<script>
  import Post from "./Post.svelte";

  export let posts;
</script>

<content>
  {#each $posts as post}
    <Post {post} />
  {/each}
</content>

<style>
  content {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap-reverse;
    justify-content: center;
    margin: 48px;
  }
</style>
