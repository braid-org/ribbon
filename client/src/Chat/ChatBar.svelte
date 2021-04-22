<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let inputEl;

  function addMessage(text) {
    if (!text.match(/^\s*$/)) {
      dispatch("send", { text });
    }
  }

  function onKeydown(event) {
    if (event.key === "Enter" || event.key === "Return") {
      addMessage(event.target.value);
      event.target.value = "";
    }
  }

  onMount(() => {
    inputEl.focus();
  });
</script>

<container>
  <input
    type="text"
    placeholder="Write a message..."
    on:keydown={onKeydown}
    bind:this={inputEl}
  />
</container>

<style>
  container {
    display: flex;
    width: 100%;
    margin-bottom: 8px;
  }

  input {
    border: 2px solid transparent;
    border-radius: 4px;
    width: 100%;
    font-size: 20px;
    line-height: 32px;
    margin-bottom: 8px;
    padding-left: 8px;
  }
  input::placeholder {
    color: #bbb;
  }
  input:focus {
    border: 2px solid cornflowerblue;
    outline: none;
  }
</style>
