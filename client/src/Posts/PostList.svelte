<script>
  import Post from "./Post.svelte";

  export let resource;

  let posts;
  $: posts = resource.store;
</script>

<content>
  {#each $posts as post}
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
