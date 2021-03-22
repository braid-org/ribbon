<script>
  import FaBlog from "svelte-icons/fa/FaBlog.svelte";
  import FaRegThumbsUp from "svelte-icons/fa/FaRegThumbsUp.svelte";
  import FaPencilAlt from "svelte-icons/fa/FaPencilAlt.svelte";
  import GoPerson from "svelte-icons/go/GoPerson.svelte";

  import { author } from "./Settings/config";

  export let page;

  const switchPage = (newPage) => () => {
    page = newPage;
  };

  const pages = [
    { id: "feed", icon: FaBlog },
    { id: "posts", icon: FaPencilAlt },
    { id: "likes", icon: FaRegThumbsUp },
    { id: "settings", icon: GoPerson, end: true },
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
  <profile> {$author} </profile>
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
    align-items: center;

    background-color: rgba(0, 0, 0, 0.75);
  }

  profile {
    display: block;
    color: white;
    margin-bottom: 32px;
    text-align: center;
    font-weight: bold;
  }

  button {
    all: unset;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 100px;
    height: 100px;
    margin: 14px;
  }
  button.end {
    margin-top: auto;
    margin-bottom: 0;
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
    profile {
      margin-bottom: 0;
      margin-right: 32px;
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
