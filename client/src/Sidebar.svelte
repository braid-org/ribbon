<script>
  import FaBlog from "svelte-icons/fa/FaBlog.svelte";
  import FaRegThumbsUp from "svelte-icons/fa/FaRegThumbsUp.svelte";
  import FaPowerOff from "svelte-icons/fa/FaPowerOff.svelte";
  import FaPencilAlt from "svelte-icons/fa/FaPencilAlt.svelte";

  export let page;

  const switchPage = (newPage) => () => {
    page = newPage;
  };

  const pages = [
    { id: "feed", icon: FaBlog },
    { id: "posts", icon: FaPencilAlt },
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

  @media only screen and (max-width: 600px) {
    sidebar {
      width: 100%;
      height: 64px;
      padding: 8px;
      flex-direction: row;
      background-color: rgba(0, 0, 0, 1);
      background: rgb(50, 50, 50);
      background: linear-gradient(
        124deg,
        rgba(50, 50, 50, 0.9) 0%,
        rgba(29, 29, 29, 0.9) 100%
      );
    }
    button {
      width: 64px;
      height: 64px;
    }
    button.end {
      margin-left: auto;
      margin-right: 32px;
    }

    icon {
      width: 40px;
      height: 40px;
    }
    icon:hover {
      width: 58px;
      height: 58px;
    }
  }
</style>
