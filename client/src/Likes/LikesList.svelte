<script>
  import Like from "./Like.svelte";

  export let records;
</script>

<content>
  {#each $records as { resource, like }}
    <Like link={like.$link} />
  {/each}
</content>

<style>
  content {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    max-width: 100%;
  }
</style>
