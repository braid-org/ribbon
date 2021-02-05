<script>
  export let size = 64;
  export let color = "white";
</script>

<icon style="--size:{size}px; --color:{color};">
  <slot />
</icon>

<style>
  icon {
    color: var(--color, white);
    display: block;
    width: var(--size, 64px);
    height: var(--size, 64px);
  }
</style>
