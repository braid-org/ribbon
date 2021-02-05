<button on:click><slot /></button>

<style>
  button {
    all: unset;

    line-height: 32px;
    padding: 8px 16px;
    margin: 8px 8px 24px 8px;

    font-family: Arial, sans;
    font-weight: 700;
    color: white;
    text-shadow: 1px 1px 4px black;

    background-color: var(--cherry);
    border: 2px solid white;
    border-radius: 5px;

    cursor: pointer;
  }
  button:hover {
    text-shadow: 1px 1px 1px black;
  }
</style>
