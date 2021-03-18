<script>
  import { slide } from "svelte/transition";
  import LikesList from "./LikesList.svelte";
  import NewLike from "./NewLike.svelte";
  import { author } from "../Settings/config";
  import { capitalize } from "../utils/capitalize";
  import { possessive } from "../utils/possessive";

  export let likes; // : Resource<Array<any>>

  function onLike({ detail }) {
    likes.append({ $link: detail.url });
  }
</script>

<page>
  <div transition:slide>
    <NewLike on:like={onLike} />
  </div>

  <h1>
    {#if $author}{possessive(capitalize($author))} {/if}Likes
  </h1>
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
  div {
    margin-top: 48px;
  }
</style>
