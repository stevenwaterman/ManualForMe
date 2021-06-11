<script lang="ts">
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

  export let value: "cross" | "blank" | "tick" = "blank";
  export let disabled: boolean = false;

  function leftClick() {
    if (value === "tick") value = "blank";
    else value = "tick";
  }

  function rightClick() {
    if (value === "cross") value = "blank";
    else value = "cross";
  }
</script>

<style>
  input {
    display: none;
  }

  button {
    border-radius: 100%;
    border-color: var(--border);
    border-width: 2px;

    background-color: white;

    width: 50px;
    height: 50px;
    margin: 0;

    position: relative;
  }

  button:enabled {
    cursor: pointer;
  }

  button:active {
    background-color: white;
  }

  button.ticked {
    background-color: var(--highlight);
  }

  button.crossed {
    background-color: var(--error);
  }

  .cross {
    color: var(--background);
    position: absolute;
    top: 0%;
    right: 0%;
    bottom: 0%;
    left: 0%;
    padding: 5px;
  }

  .tick {
    color: var(--background);
    position: absolute;
    top: 0%;
    right: 0%;
    bottom: 0%;
    left: 0%;
    padding: 7px;
  }
</style>

<button disabled={disabled} on:click={leftClick} on:contextmenu|preventDefault={rightClick} class:ticked={value === "tick"}  class:crossed={value === "cross"}>
  {#if value === "cross"}
    <div class="cross">
      <FontAwesomeIcon icon={faTimes} style="vertical-align: 0; height: 100%; width: 100%;"/>
    </div>
  {:else if value === "tick"}
    <div class="tick">
      <FontAwesomeIcon icon={faCheck} style="vertical-align: 0; height: 100%; width: 100%;"/>
    </div>
  {/if}
</button>

<input type="radio" bind:group={value} value="cross">
<input type="radio" bind:group={value} value="blank">
<input type="radio" bind:group={value} value="tick">