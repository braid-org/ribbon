<script>
  // import { cleanHtml } from "~/utils/cleanHtml";

  export let author;
  export let body;
</script>

<container>
  <!-- <id-circle style="background-color:{color}" /> -->
  <div>
    <author>{author}</author>
    <content>{@html body}</content>
  </div>
</container>

<style>
  container {
    display: flex;
    align-items: flex-start;

    color: #333;
    background-color: #eee;

    border-radius: 9px 9px 9px 0;

    padding: 6px 10px;
    margin: 3px;
  }

  author {
    font-weight: bold;
  }

  content {
    display: block;
    margin-top: 4px;
  }

  id-circle {
    display: block;
    flex-shrink: 0;

    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 100%;
    margin-left: 0px;
    margin-right: 8px;
  }
</style>
