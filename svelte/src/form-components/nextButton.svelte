<script lang="ts">
  import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from "fontawesome-svelte";
</script>

<style>
  button {
    cursor: pointer;
    color: var(--background);
    background-color: var(--button);
    border: none;
    border-radius: 1em;
    padding: 0.5em 0.8em 0.5em 1em;
    font-size: 20pt;
    font-weight: 600;
    margin: 0;
  }

  button:active {
    background-color: var(--highlight)
  }
</style>

<button>Next <FontAwesomeIcon icon={faChevronRight} style="vertical-align: -0.15em; margin-left: 0.25em;"/></button>