<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import cssVars from 'svelte-css-vars';

  export let icon: IconDefinition;
  export let size: string = "10px";
  export let tooltip: string;

  export let selected: boolean = false;
  export let value: string;
  export let defaultValue: string;

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
    transition: color 0.1s ease;
    font-size: calc(var(--size));
    width: calc(var(--size));
    height: calc(var(--size));
  }

  .selected {
    color: var(--highlight);
  }
</style>

<div class="icon" class:selected={selected} use:cssVars={{ size }} on:click={tryDeselect}>
  <FontAwesomeIcon icon={icon} style="vertical-align: 0;" title={tooltip}/>
</div>