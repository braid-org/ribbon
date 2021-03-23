<script>
  import { onMount } from "svelte";

  import { ArrayResource } from "./braid";

  import Background from "./Background.svelte";
  import Sidebar from "./Sidebar.svelte";

  import FeedPage from "./Feed/FeedPage.svelte";
  import PostsPage from "./Posts/PostsPage.svelte";
  import LikesPage from "./Likes/LikesPage.svelte";
  import SettingsPage from "./Settings/SettingsPage.svelte";

  import { author } from "./Settings/config";
  import { authorUrl, serverUrl } from "./Settings/config";
  import { getHashParams } from "./utils/getHashParams";

  let authors, feed, posts, likes;

  $: {
    if (authors) authors.cancel();
    const url = $serverUrl + "/authors";
    authors = new ArrayResource(url);
  }

  $: {
    if (feed) feed.cancel();
    const url = $authorUrl + "/feed";
    feed = new ArrayResource(url);
  }

  $: {
    if (posts) posts.cancel();
    const url = $authorUrl + "/posts";
    posts = new ArrayResource(url);
  }

  $: {
    if (likes) likes.cancel();
    const url = $authorUrl + "/likes";
    likes = new ArrayResource(url);
  }

  let page = "posts";

  function handleHashParams(event) {
    const params = getHashParams();
    if (params.author) {
      $author = params.author;
    }
  }

  onMount(handleHashParams);
</script>

<Background />

<Sidebar bind:page />

<app>
  {#if page === "feed"}
    <FeedPage records={feed} />
  {:else if page === "posts"}
    <PostsPage records={posts} />
  {:else if page === "likes"}
    <LikesPage {likes} />
  {:else if page === "settings"}
    <SettingsPage {authors} on:done={() => (page = "posts")} />
  {/if}
</app>

<svelte:window on:hashchange={handleHashParams} />

<style>
  app {
    display: block;
    margin-left: 160px;
  }
  @media only screen and (max-width: 600px) {
    app {
      margin-left: 0;
      margin-top: 88px;
    }
  }
</style>
