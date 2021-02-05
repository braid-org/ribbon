<script>
  import FaBlog from "svelte-icons/fa/FaBlog.svelte";
  import FaRegThumbsUp from "svelte-icons/fa/FaRegThumbsUp.svelte";

  export let page;

  const switchPage = (newPage) => () => {
    page = newPage;
  };
</script>

<sidebar>
  <button on:click={switchPage("posts")}>
    <icon class:chosen={page === "posts"}>
      <FaBlog />
    </icon>
  </button>

  <button on:click={switchPage("likes")}>
    <icon class:chosen={page === "likes"}>
      <FaRegThumbsUp />
    </icon>
  </button>
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
    color: rgba(243, 19, 105, 1);
  }
</style>
