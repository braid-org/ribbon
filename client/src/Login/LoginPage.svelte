<script>
  import { createEventDispatcher } from "svelte";
  import { get } from "svelte/store";
  import { author, authorUrl, customAuthorUrl } from "../config";
  import { capitalize } from "../utils/capitalize";
  import { sanitize } from "../utils/sanitize";
  import Button from "../components/Button.svelte";

  export let authors;

  let shortnameEl;

  const dispatch = createEventDispatcher();

  function maybeCreateAuthor(shortname) {
    const found = get(authors).find((author) => author.shortname === shortname);
    if (shortname && !found) {
      authors.append({ shortname });
    }
  }

  function handleSubmitOnEnter(event) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }

  function handleLogin() {
    const shortname = sanitize(shortnameEl.value);
    maybeCreateAuthor(shortname);
    $author = shortname;
    dispatch("done");
  }
</script>

<page>
  <h1>Login</h1>
  <setting>
    <label for="shortname">Username</label>
    <input
      type="text"
      id="shortname"
      bind:this={shortnameEl}
      on:keydown={handleSubmitOnEnter}
    />
  </setting>
  <buttons>
    <Button on:click={handleLogin}>Sign In</Button>
  </buttons>
</page>

<style>
  page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    color: white;
  }

  setting {
    display: flex;
    flex-direction: column;
    width: 400px;
  }

  input {
    line-height: 32px;
    border-radius: 8px;
    border: 0;
    font-size: 18px;
    padding-left: 8px;
  }

  buttons {
    display: block;
    margin-top: 16px;
  }

  label {
    font-size: 24px;
    color: white;
    margin-top: 24px;
  }
</style>
