<script lang="ts">
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

  export let value: "cross" | "blank" | "tick" = "blank";

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

    cursor: pointer;
    position: relative;
  }

  button:active {
    background-color: white;
  }

  .cross {
    color: var(--error);
    position: absolute;
    top: 10%;
    right: 10%;
    bottom: 10%;
    left: 10%;
  }

  .tick {
    color: var(--highlight);
    position: absolute;
    top: 15%;
    right: 15%;
    bottom: 15%;
    left: 15%;
  }
</style>

<button on:click={leftClick} on:contextmenu|preventDefault={rightClick}>
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