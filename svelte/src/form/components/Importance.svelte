<script lang="ts">
  import { faExclamationCircle, faBan } from '@fortawesome/free-solid-svg-icons';
  import ToggleIcon from './ToggleIcon.svelte';

  export let importance: "low" | "mid" | "high" = "mid";
  export let size: string;
  export let separation: string;
  
  // TODO fix display: none for a11y
</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  span {
    text-align: center;
    margin-bottom: .5em;
  }

  input[type="radio"] {
    display: none;
  }
</style>

<div class="column">
  <span>
    {#if importance === "low"}
      Low Importance
    {:else if importance === "mid"}
      Normal importance
    {:else}
      High Importance
    {/if}
  </span>
  <div class="row">
    <label for="lowPriorityRadio">
      <ToggleIcon icon={faBan} selected={importance === "low"} bind:value={importance} defaultValue="mid" size={size} tooltip="Low Importance"/>
      <input type=radio id="lowPriorityRadio" bind:group={importance} value="low">
    </label>
  
    <div style={`width: ${separation};`}/>
  
    <input type=radio bind:group={importance} value="mid">
  
    <label for="highPriorityRadio">
      <ToggleIcon icon={faExclamationCircle} selected={importance === "high"} bind:value={importance} defaultValue="mid" size={size} tooltip="High Importance"/>
      <input type=radio id="highPriorityRadio" bind:group={importance} value="high">
    </label>
  </div>
</div>
