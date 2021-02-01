<script>
  import Post from "./Post.svelte";
  import Background from "./Background.svelte";
  import { listen } from "braidjs";

  let posts = [];
  (async () => {
    for await (const { value } of listen("http://localhost:3000/")) {
      posts = JSON.parse(value);
    }
  })();
</script>

<Background />

<content>
  {#each posts as post}
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
