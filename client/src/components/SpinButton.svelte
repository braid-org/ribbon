<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let clicked = false;
  function onClick() {
    clicked = true;
    dispatch("click");
    setTimeout(() => {
      clicked = false;
    }, 500);
  }
</script>

<button class:spin={clicked} on:click={onClick}><slot /></button>

<style>
  button {
    all: unset;
  }
  button:hover {
    transform: rotateZ(10deg);
  }
  .spin {
    animation: spin 0.5s ease-in-out;
  }
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
