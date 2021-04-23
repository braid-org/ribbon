<script>
  import { createEventDispatcher } from "svelte";
  import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
  import Icon from "../components/Icon.svelte";

  import NotificationSetting from "./NotificationSetting.svelte";

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch("close");
  }
</script>

<r-popup>
  <r-message>
    <NotificationSetting />
  </r-message>
  <r-close on:click={handleClose}><Icon size={48}><IoIosClose /></Icon></r-close
  >
</r-popup>

<style>
  r-popup {
    position: relative;
    height: 72px;

    margin-left: -8px;
    margin-right: -8px;
    background-color: rgba(255, 255, 255, 0.25);
    padding-left: 16px;
    padding-right: 16px;
  }

  r-message {
    display: flex;
    height: 72px;
    justify-content: center;
    align-items: center;
  }

  r-close {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0px;
    right: 0px;

    width: 72px;
    height: 72px;

    color: rgb(200, 200, 200);
  }

  r-close:hover {
    color: white;
  }
</style>
