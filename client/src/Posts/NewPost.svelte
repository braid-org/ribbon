<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let title;
  let body;
</script>

<bar>
  <h1>New Post</h1>
  <input bind:value={title} placeholder="title" />
  <textarea bind:value={body} placeholder="post" />
  <button on:click={() => dispatch("post", { title, body })}>Post</button>
</bar>

<style>
  bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 16px;
    min-width: 600px;
    margin: -32px 32px 32px 32px;
  }

  h1 {
    font-family: "Poppins", sans-serif;
    font-size: 32px;
    color: white;
  }

  input,
  textarea {
    all: unset;

    font-family: "Poppins", sans-serif;
    font-size: 24px;
    border-radius: 4px;

    padding: 8px;
    margin: 16px;

    color: white;
    background-color: rgba(0, 0, 0, 0.25);
  }

  input {
    width: 500px;
    height: 40px;
  }

  textarea {
    width: 500px;
    height: 120px;
  }

  button {
    all: unset;

    line-height: 32px;
    padding: 8px 16px;
    margin: 8px 8px 24px 8px;

    font-family: Arial, sans;
    font-weight: 700;
    color: white;
    text-shadow: 1px 1px 4px black;

    background-color: rgba(243, 19, 105, 1);
    border: 2px solid white;
    border-radius: 5px;
  }
  button:hover {
    text-shadow: 1px 1px 1px black;
  }
</style>
