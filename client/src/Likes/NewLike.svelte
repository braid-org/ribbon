<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../components/Button.svelte";
  import Icon from "../components/Icon.svelte";
  import IoIosLink from "svelte-icons/io/IoIosLink.svelte";

  const dispatch = createEventDispatcher();

  let url;

  function handleLike() {
    if (url && url.match(/^https/)) {
      dispatch("like", { url });
    }
  }
</script>

<section>
  <h1>New Like</h1>
  <div>
    <icon-wrapper>
      <Icon color="white"><IoIosLink /></Icon>
    </icon-wrapper>
    <input bind:value={url} placeholder="https://example.com/" />
  </div>
  <Button on:click={handleLike}>Like</Button>
</section>

<style>
  icon-wrapper {
    display: block;
    position: relative;
    margin-right: -64px;
    right: 64px;
  }
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 16px;
    margin: 0 64px 32px 64px;
  }

  h1 {
    font-size: 32px;
    color: white;
  }

  div {
    display: flex;
    align-items: center;
  }

  input {
    all: unset;

    font-size: 24px;
    border-radius: 4px;

    padding: 16px 32px;
    margin: 16px;

    color: white;
    background-color: rgba(0, 0, 0, 0.25);
    min-width: 300px;
    height: 40px;
  }
</style>
