<script>
  import Post from "./Post.svelte";

  export let records;
</script>

<content>
  {#each $records as { resource, post }}
    <Post title={post.title} body={post.body} />
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
