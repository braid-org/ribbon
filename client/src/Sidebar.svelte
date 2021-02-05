<script>
  import FaBlog from "svelte-icons/fa/FaBlog.svelte";
  import FaRegThumbsUp from "svelte-icons/fa/FaRegThumbsUp.svelte";
  import FaPowerOff from "svelte-icons/fa/FaPowerOff.svelte";

  export let page;

  const switchPage = (newPage) => () => {
    page = newPage;
  };

  const pages = [
    { id: "posts", icon: FaBlog },
    { id: "likes", icon: FaRegThumbsUp },
    { id: "settings", icon: FaPowerOff, end: true },
  ];
</script>

<sidebar>
  {#each pages as pg}
    <button on:click={switchPage(pg.id)} class:end={pg.end}>
      <icon class:chosen={page === pg.id}>
        <svelte:component this={pg.icon} />
      </icon>
    </button>
  {/each}
</sidebar>

<style>
  sidebar {
    position: fixed;
    top: 0;
    left: 0;

    width: 128px;
    height: 100%;
    padding: 16px;

    display: flex;
    flex-direction: column;

    background-color: rgba(0, 0, 0, 0.75);
  }

  button {
    all: unset;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 128px;
    height: 128px;
  }
  button.end {
    margin-top: auto;
    margin-bottom: 16px;
  }

  icon {
    color: rgba(210, 210, 210, 1);
    display: block;
    width: 80px;
    height: 80px;
  }

  icon:hover {
    color: rgba(255, 255, 255, 1);
    width: 116px;
    height: 116px;
  }

  icon.chosen {
    color: var(--cherry);
  }
</style>
