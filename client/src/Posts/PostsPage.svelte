<script>
  import { slide } from "svelte/transition";
  import NewPost from "./NewPost.svelte";
  import PostList from "./PostList.svelte";
  import NewPostButton from "./NewPostButton.svelte";

  export let resource;

  let newPostVisible = false;

  function onPost({ detail }) {
    const { title, body } = detail;
    resource.append({ title, body });
    newPostVisible = false;
  }
</script>

<NewPostButton bind:visible={newPostVisible} />

{#if newPostVisible}
  <div transition:slide>
    <NewPost on:post={onPost} />
  </div>
{/if}

<PostList {resource} />
