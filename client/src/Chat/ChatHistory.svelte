<script>
  import { beforeUpdate, afterUpdate } from "svelte";
  // import { cleanHtml } from "~/utils/cleanHtml";

  import Message from "./Message.svelte";

  export let messages;
  export let me;

  let div;

  afterUpdate(() => {
    if (!div) return;
    div.scrollTo(0, div.scrollHeight);
  });
</script>

<container bind:this={div}>
  {#if messages.length === 0}
    <note>Empty chat history</note>
  {:else}
    <scroll-container>
      {#each $messages as message}
        {#if message.author === me}
          <message class:mine={true}>{@html message.body}</message>
        {:else}
          <Message author={message.author} body={message.body} />
        {/if}
      {/each}
    </scroll-container>
  {/if}
</container>

<style>
  container {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    margin-bottom: 4px;

    overflow-y: scroll;
  }

  container :global(a),
  container :global(a:visited) {
    color: yellow;
  }

  scroll-container {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
  }

  note {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    color: #333;
  }

  message.mine {
    color: white;
    background-color: #1277d6;

    border-radius: 9px 9px 0 9px;

    align-self: flex-end;
    text-align: right;

    padding: 6px 10px;
    margin: 3px;
  }
</style>
