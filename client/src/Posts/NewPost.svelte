<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../components/Button.svelte";

  const dispatch = createEventDispatcher();

  let title;
  let body;

  function handlePost() {
    if ((title && title !== "") || (body && body !== "")) {
      dispatch("post", { title, body });
    }
  }
</script>

<section>
  <h1>New Post</h1>
  <input bind:value={title} placeholder="title" />
  <textarea bind:value={body} placeholder="post" />
  <Button on:click={handlePost}>Post</Button>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 16px;
    min-width: 360px;
    margin: 0 32px 32px 32px;
  }

  h1 {
    font-size: 32px;
    color: white;
  }

  input,
  textarea {
    all: unset;

    font-size: 24px;
    border-radius: 4px;

    padding: 8px;
    margin: 16px;

    color: white;
    background-color: rgba(0, 0, 0, 0.25);
  }

  input {
    width: 100%;
    height: 40px;
  }

  textarea {
    width: 100%;
    height: 120px;
  }

  @media only screen and (max-width: 600px) {
    bar {
    }
  }
</style>
