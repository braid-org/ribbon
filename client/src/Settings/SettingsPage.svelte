<script>
  import { createEventDispatcher } from "svelte";
  import Select from "svelte-select";
  import { author, customAuthorUrl } from "./config";

  const dispatch = createEventDispatcher();
  const CUSTOM_URL_LABEL = "Custom URL";

  function authorName(shortname) {
    return (shortname || CUSTOM_URL_LABEL).toUpperCase();
  }

  const items = ["default", "friend", null].map((shortname) => ({
    value: shortname,
    label: authorName(shortname),
  }));

  let selectedValue;
  $: selectedValue = $customAuthorUrl
    ? { value: null, label: CUSTOM_URL_LABEL }
    : { value: $author, label: authorName($author) };

  let typedUrl;
  $: typedUrl = $customAuthorUrl;

  function handleSelect({ detail }) {
    selectedValue = detail;
    $author = selectedValue.value;
    $customAuthorUrl = null;
  }

  function handleTypedUrlChanged(event) {
    console.log("changed", event.target.value);
    $customAuthorUrl = typedUrl;
    dispatch("done");
  }
</script>

<page>
  <h1>Settings</h1>
  <setting>
    <label for="typedUrl">Author</label>
    <Select
      {items}
      {selectedValue}
      containerClasses="settings-select"
      on:select={handleSelect}
    />
    {#if selectedValue.value === null}
      <input
        name="typedUrl"
        class="big"
        placeholder="https://example.com/author/default"
        bind:value={typedUrl}
        on:change={handleTypedUrlChanged}
      />
    {/if}
  </setting>
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
    max-width: 300px;
  }

  :global(.settings-select) {
    width: 300px;
  }

  label {
    font-size: 24px;
    color: white;
  }

  input.big {
    font-size: 24px;
    line-height: 32px;

    margin: 16px 0px;
    padding: 8px 16px;

    border: 2px solid white;
    border-radius: 4px;
    width: 300px;
  }

  bar {
    display: block;
    margin-top: 24px;
  }
</style>
