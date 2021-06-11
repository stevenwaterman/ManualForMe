<script lang="ts">
  import { faLock } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import cssVars from 'svelte-css-vars';

  export let hidden: boolean = false;
  export let size: string;
  
  // TODO fix display: none for a11y
</script>

<style>
  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  span {
    text-align: center;
    margin-bottom: .5em;
  }

  input[type="checkbox"] {
    display: none;
  }

  label {
    margin: auto;
  }

  .icon {
    color: var(--border);
    cursor: pointer;
    transition: color 0.1s ease;
    font-size: calc(var(--size));
    width: calc(var(--size));
    height: calc(var(--size));
  }

  .selected {
    color: var(--highlight);
  }
</style>


<div class="column">
  <span>
    {#if hidden}
      Private
    {:else}
      Public
    {/if}
  </span>
  <label for="hiddenCheckbox">
    <div class="icon" class:selected={hidden} use:cssVars={{ size }}>
      <FontAwesomeIcon icon={faLock} style="vertical-align: 0;" title="Private"/>
    </div>
    <input type=checkbox id="hiddenCheckbox" bind:checked={hidden}>
  </label>
</div>
