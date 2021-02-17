<script>
  import Like from "./Like.svelte";

  export let likes;
</script>

<content>
  {#each $likes as like}
    <Like {like} />
  {/each}
</content>

<style>
  content {
    display: flex;
    flex-direction: column-reverse;
    flex-wrap: nowrap;
    justify-content: center;
    margin: 48px;
  }
</style>
