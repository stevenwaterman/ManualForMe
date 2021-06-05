<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  export let icon: IconDefinition;
  export let size: string = "lg";

  export let selected;

  export let value;
  export let defaultValue;

  function tryDeselect() {
    if (selected) {
      setTimeout(() => {
        value = defaultValue;
      }, 0)
    }
  }
</script>

<style>
  .icon {
    color: var(--border);
    cursor: pointer;
    transition: color 0.25s ease;
    margin: 0.5em;
  }

  .selected {
    color: var(--highlight);
  }
</style>

<div class="icon" class:selected={selected} on:click={tryDeselect}>
  <FontAwesomeIcon icon={icon} size={size}/>
</div>