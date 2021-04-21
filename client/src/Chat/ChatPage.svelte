<script>
  import ChatBar from "./ChatBar.svelte";
  import ChatHistory from "./ChatHistory.svelte";

  export let messages;
  export let me;

  let chatBar;

  function handleSend({ detail }) {
    messages.append({ author: me, body: detail.text });
  }
</script>

<page>
  <ChatHistory {messages} {me} />
  <bottom>
    <ChatBar bind:this={chatBar} on:send={handleSend} />
  </bottom>
</page>

<style>
  page {
    display: flex;
    flex-direction: column;
    /* align-items: flex-end; */
    height: 100%;
  }

  bottom {
    display: flex;
  }
</style>
