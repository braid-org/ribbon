<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../components/Button.svelte";
  import Icon from "../Icon.svelte";
  import IoIosLink from "svelte-icons/io/IoIosLink.svelte";

  const dispatch = createEventDispatcher();

  let url;
</script>

<bar>
  <h1>New Like</h1>
  <div>
    <Icon color="white"><IoIosLink /></Icon>
    <input bind:value={url} placeholder="https://example.com/" />
  </div>
  <Button on:click={() => dispatch("like", { url })}>Like</Button>
</bar>

<style>
  bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 16px;
    min-width: 360px;
    margin: -32px 32px 32px 32px;
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

    padding: 8px;
    margin: 16px;

    color: white;
    background-color: rgba(0, 0, 0, 0.25);
    width: 100%;
    height: 40px;
  }
</style>
