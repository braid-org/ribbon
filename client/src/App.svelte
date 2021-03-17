<script>
  import { ArrayResource } from "./braid";

  import Background from "./Background.svelte";
  import Sidebar from "./Sidebar.svelte";

  import FeedPage from "./Feed/FeedPage.svelte";
  import PostsPage from "./Posts/PostsPage.svelte";
  import LikesPage from "./Likes/LikesPage.svelte";
  import SettingsPage from "./Settings/SettingsPage.svelte";

  import { serverUrl } from "./Settings/config";

  let feed, posts, likes;

  $: {
    if (feed) feed.cancel();
    const url = $serverUrl + "/feed";
    feed = new ArrayResource(url);
  }

  $: {
    if (posts) posts.cancel();
    const url = $serverUrl + "/posts";
    posts = new ArrayResource(url);
  }

  $: {
    if (likes) likes.cancel();
    const url = $serverUrl + "/likes";
    likes = new ArrayResource(url);
  }

  let page = "posts";
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
    <SettingsPage on:done={() => (page = "posts")} />
  {/if}
</app>

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
