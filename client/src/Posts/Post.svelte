<script>
  import DOMPurify from "dompurify";
  import anchorme from "anchorme";

  export let title;
  export let body;
  export let resource;

  function format(text) {
    const cleanText = DOMPurify.sanitize(text);
    return anchorme({
      input: cleanText,
      options: {
        truncate: 30,
        middleTruncation: true,
        attributes: {
          target: "_blank",
        },
      },
    });
  }
</script>

<container>
  <square class="soft-overflow centered" class:centered={!title || !body}>
    {#if title}
      <div class="title" class:rainbow={body} class:attention={!body}>
        {@html format(title)}
      </div>
    {/if}
    {#if body}
      <div class="body" class:paragraph={!title}>
        {@html format(body)}
      </div>
    {/if}
  </square>
  {#if resource}
    <div class="resource">{resource}</div>
  {/if}
</container>

<style>
  container {
    display: block;
    position: relative;
  }
  square {
    display: flex;
    flex-direction: column;

    width: 200px;
    height: 200px;
    margin: 16px;
    padding: 16px 32px;

    box-shadow: 6px 6px 30px rgba(0, 0, 0, 0.65);
    border-radius: 4px;

    overflow: auto;
    text-overflow: ellipsis;
  }
  square.centered {
    justify-content: center;
  }

  .soft-overflow {
    background: linear-gradient(black 30%, rgba(0, 0, 0, 0)),
      linear-gradient(rgba(0, 0, 0, 0), black 70%) 0 100%,
      radial-gradient(
        farthest-side at 90% -10%,
        rgba(255, 255, 255, 0.5),
        rgba(0, 0, 0, 0)
      ),
      radial-gradient(
          farthest-side at -10% 90%,
          rgba(255, 255, 255, 0.5),
          rgba(0, 0, 0, 0)
        )
        0 100%;
    background-repeat: no-repeat;
    background-color: black;
    background-size: 100% 40px, 100% 40px, 100% 18px, 100% 18px;

    background-attachment: local, local, scroll, scroll;
  }

  .title {
    font-weight: 700;
    font-size: 26px;
    text-align: center;
    line-height: 32px;

    margin-bottom: 16px;
  }

  .title.attention {
    font-size: 32px;
    line-height: 48px;
    color: var(--cherry);
  }

  .title.rainbow {
    color: rgba(200, 91, 222, 1);
    background: linear-gradient(
      124deg,
      rgba(249, 58, 222, 1) 0%,
      rgba(60, 211, 238, 1) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .body {
    color: white;
    font-weight: 300;
    font-size: 20px;
  }
  .body.paragraph {
    text-indent: 1.2em;
    font-size: 15px;
  }

  .resource {
    display: none;

    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
    position: absolute;
    text-align: center;
    width: 100%;
    bottom: -8px;
  }

  container:hover .resource {
    display: block;
  }
</style>
