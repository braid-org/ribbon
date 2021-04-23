<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value = false;

  const toggle = () => {
    value = !value;
    dispatch("change", value);
  };
</script>

<container on:mousedown|stopPropagation={toggle}>
  <lbl>
    <slot>
      {#if value}On{:else}Off{/if}
    </slot>
  </lbl>

  <toggle class:enabled={value}>
    <knob class:enabled={value} />
  </toggle>
</container>

<style>
  container {
    display: flex;
    align-items: center;
  }

  toggle {
    position: relative;
    display: block;
    width: 48px;
    height: 24px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 32px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  toggle.enabled {
    background-color: rgba(200, 200, 200, 0.35);
  }

  knob {
    position: relative;
    display: block;
    width: 18px;
    height: 18px;
    top: 2px;
    left: 2px;
    background-color: rgba(200, 200, 200, 1);
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 100%;
  }

  knob.enabled {
    left: 26px;
    background-color: rgba(140, 215, 100, 1);
  }

  lbl {
    margin-right: 12px;
  }
</style>
