<script>
  import SpinButton from "../components/SpinButton.svelte";
  import Icon from "../components/Icon.svelte";
  import FaPenSquare from "svelte-icons/fa/FaPenSquare.svelte";

  export let visible;
  export let icon = FaPenSquare;
  export let highlight = "rgba(0, 0, 0, 0.25)";

  function toggleNewPost() {
    visible = !visible;
  }
</script>

<div>
  <SpinButton on:click={toggleNewPost}>
    <Icon color={visible ? highlight : "white"}>
      <svelte:component this={icon} />
    </Icon>
  </SpinButton>
  {#if !visible}
    <lbl on:click={toggleNewPost}><slot /></lbl>
  {/if}
</div>

<style>
  div {
    display: flex;
    margin-bottom: 8px;
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
