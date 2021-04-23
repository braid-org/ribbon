<script>
  import ToggleSwitch from "../components/ToggleSwitch.svelte";
  import { notify } from "../config";

  const hasBrowserSupport = "Notification" in window;

  let permission = Notification.permission;

  let permitted = false;
  $: permitted = permission === "granted";

  let denied = false;
  $: denied = permission === "denied";

  async function toggle({ detail: enabled }) {
    $notify = enabled;
    if (enabled) {
      permission = await Notification.requestPermission();
    }
  }
</script>

{#if hasBrowserSupport}
  <r-notifications>
    <ToggleSwitch value={$notify && (permitted || denied)} on:change={toggle}>
      <div>Notifications are <b>{$notify && (permitted || denied) ? "ON" : "OFF"}</b></div>
    </ToggleSwitch>
    {#if $notify && denied}
      <r-denied>
        Denied
        <r-denied-dot />
      </r-denied>
    {/if}
  </r-notifications>
{/if}

<style>
  r-notifications {
    display: flex;
    align-items: center;
  }

  r-denied {
    display: flex;
    align-items: center;
    color: white;
    font-weight: bold;
    padding-left: 8px;
  }

  r-denied-dot {
    display: block;
    background-color: var(--cherry);
    width: 16px;
    height: 16px;
    border-radius: 100%;
    margin-left: 8px;
  }

  div {
    color: white;
    font-size: 16px;
    font-weight: normal;
  }
</style>
