<script>
  import { slide } from "svelte/transition";
  import LikesList from "./LikesList.svelte";
  import NewLike from "./NewLike.svelte";
  import SpinToggleButton from "../components/SpinToggleButton.svelte";

  import { author } from "../Settings/config";
  import { capitalize } from "../utils/capitalize";
  import { possessive } from "../utils/possessive";

  export let likes; // : Resource<Array<any>>

  let newLikeVisible = false;

  function onLike({ detail }) {
    likes.append({ $link: detail.url });
    newLikeVisible = false;
  }
</script>

<page>
  <h1>
    {#if $author}{possessive(capitalize($author))} {/if}Likes
  </h1>

  <SpinToggleButton bind:visible={newLikeVisible}>New Like</SpinToggleButton>

  {#if newLikeVisible}
    <div transition:slide>
      <NewLike on:like={onLike} />
    </div>
  {/if}

  <LikesList records={likes} />
</page>

<style>
  page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h1 {
    font-size: 32px;
    color: white;
  }
</style>
