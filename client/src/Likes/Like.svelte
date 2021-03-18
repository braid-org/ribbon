<script>
  import Icon from "../components/Icon.svelte";
  import FaRegThumbsUp from "svelte-icons/fa/FaRegThumbsUp.svelte";

  export let link;
</script>

<div>
  <row>
    <icon-wrapper>
      <Icon size={24} color="white"><FaRegThumbsUp /></Icon>
    </icon-wrapper>
    {link}
  </row>
</div>

<style>
  row {
    display: flex;
  }
  icon-wrapper {
    margin-right: 16px;
  }

  div {
    position: relative;
    display: flex;
    flex-direction: column;

    min-width: 300px;
    margin: 16px 0px;
    padding: 16px 32px;

    box-shadow: 6px 6px 30px rgba(0, 0, 0, 0.65);
    border-radius: 4px;

    overflow: auto;
    text-overflow: ellipsis;

    color: white;
    font-weight: 300;
    font-size: 20px;
  }
</style>
