<script>
  import ToggleSwitch from "../components/ToggleSwitch.svelte";
  import { notify, author } from "../Settings/config";

  const hasBrowserSupport = "Notification" in window;

  let permission = Notification.permission;
  let permitted;
  $: permitted = permission === "granted";

  function askPermission() {
    Notification.requestPermission()
      .then((result) => {
        permission = result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function toggle({ detail: enabled }) {
    if (enabled) {
      if (!permitted) askPermission();
      $notify = $author;
    } else {
      notify.set(null);
    }
  }
</script>

{#if hasBrowserSupport}
  <container>
    <ToggleSwitch enabled={permitted && $notify} on:change={toggle} let:enabled={enabled}>
      <div>Notifications are <b>{enabled ? "ON" : "OFF"}</b></div>
    </ToggleSwitch>
  </container>
{/if}

<style>
  container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  div {
    color: white;
    font-size: 16px;
    font-weight: normal;
  }
</style>
