<script>
  import { slide } from "svelte/transition";
  import NewLike from "./NewLike.svelte";

  export let likes; // : Resource<Array<any>>

  function onLike({ detail }) {
    likes.append({ $link: detail.url });
  }
</script>

<div transition:slide>
  <NewLike on:like={onLike} />
</div>

<style>
  div {
    margin-top: 48px;
  }
</style>
