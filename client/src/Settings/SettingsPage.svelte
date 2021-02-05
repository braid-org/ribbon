<script>
  import { createEventDispatcher } from "svelte";
  import { get } from "svelte/store";
  import { config } from "./config";
  import Button from "../components/Button.svelte";

  const dispatch = createEventDispatcher();

  let serverUrl = get(config.serverUrl);

  function applySettings() {
    config.serverUrl.set(serverUrl);
    dispatch("done");
  }
</script>

<page>
  <h1>Settings</h1>
  <setting>
    <label for="serverUrl">Server</label>
    <input
      name="serverUrl"
      class="big"
      bind:value={serverUrl}
      placeholder="https://example.com"
    />
  </setting>
  <bar>
    <Button on:click={applySettings}>Apply</Button>
  </bar>
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
  }

  label {
    font-size: 24px;
    margin-left: 16px;
    color: white;
  }

  input.big {
    font-size: 24px;
    line-height: 32px;

    min-width: 440px;
    margin: 16px;
    padding: 8px 16px;

    border: 2px solid white;
    border-radius: 4px;
  }

  bar {
    display: block;
    margin-top: 24px;
  }
</style>
