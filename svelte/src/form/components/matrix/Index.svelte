<script lang="ts">
  import cssVars from "svelte-css-vars"
  import ThreeStateButton from "./ThreeStateButton.svelte";
  export let xValues: string[];
  export let yValues: string[];

  let values: {
    x: string;
    y: string;
    value: "cross" | "blank" | "tick"
  }[][] = yValues.map(y => 
              xValues.flatMap(x => 
                ({ x, y, value: "blank" })))

  export let value: {
    x: string;
    y: string;
    value: "cross" | "blank" | "tick"
  }[];
  $: value = values.flat();

  let css: {xCount: number};
  $: css = {
    xCount: xValues.length
  }

  // TODO make top row sticky with full cell background
  // TODO make all cells same width
  // TODO add axis labels
  // TODO hide some values to begin with
</script>

<style>
  .grid {
    display: inline-grid;
    grid-template-columns: 100px repeat(var(--xCount), 1fr);
    gap: 1em;
    align-items: center;
    justify-items: center;
  }

  .header {
    word-wrap: break-word;
    position: sticky;
    top: 1em;
    background-color: var(--background);
    padding: 0.5em;
    z-index: 1;
    border-bottom: 1px solid var(--border);
  }
</style>

<div class="grid" use:cssVars={css}>
  <div/>
  {#each xValues as xValue}
    <span class="header">{xValue}</span>
  {/each}

  {#each values as row, yIdx}
    <span>{yValues[yIdx]}</span>

    {#each row as config}  
      <ThreeStateButton bind:value={config.value}/>
    {/each}
  {/each}
</div>