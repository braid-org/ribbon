<script>
  import SpinButton from "../components/SpinButton.svelte";
  import Icon from "../components/Icon.svelte";
  import IoIosAddCircleOutline from "svelte-icons/io/IoIosAddCircleOutline.svelte";

  export let visible;

  const highlight = "rgba(0, 0, 0, 0.25)";

  function toggleNewPost() {
    visible = !visible;
  }
</script>

<div>
  <SpinButton on:click={toggleNewPost}>
    <Icon color={visible ? highlight : "white"}><IoIosAddCircleOutline /></Icon>
  </SpinButton>
  {#if !visible}
    <lbl on:click={toggleNewPost}>New Like</lbl>
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
