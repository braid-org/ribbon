<script>
  import SpinButton from "./SpinButton.svelte";
  import Icon from "../Icon.svelte";
  import FaPenSquare from "svelte-icons/fa/FaPenSquare.svelte";

  export let visible;

  const highlight = "rgba(0, 0, 0, 0.25)";

  function toggleNewPost() {
    visible = !visible;
  }
</script>

<div>
  <SpinButton on:click={toggleNewPost}>
    <Icon color={visible ? highlight : "white"}><FaPenSquare /></Icon>
  </SpinButton>
  {#if !visible}
    <lbl on:click={toggleNewPost}>New Post</lbl>
  {/if}
</div>

<style>
  div {
    display: flex;
  }
  lbl {
    display: flex;
    align-items: center;
    margin-left: 16px;

    /* font-family: "Poppins", sans-serif; */
    font-weight: 700;
    font-size: 26px;

    color: white;

    cursor: pointer;
  }
</style>
