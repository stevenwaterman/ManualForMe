<script lang="ts">
  import { faExclamationCircle, faBan } from '@fortawesome/free-solid-svg-icons';
  import ToggleIcon from './toggleIcon.svelte';

  export let value: "low" | "mid" | "high" = "mid";
  export let size: string;
  export let separation: string;
  
  // TODO fix display: none for a11y
</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }

  input[type="radio"] {
    display: none;
  }
</style>

<div class="row">
  <label for="lowPriorityRadio">
    <ToggleIcon icon={faBan} selected={value === "low"} bind:value={value} defaultValue="mid" size={size} tooltip="Low Importance"/>
    <input type=radio id="lowPriorityRadio" bind:group={value} value="low">
  </label>

  <div style={`width: ${separation};`}/>

  <input type=radio bind:group={value} value="mid">

  <label for="highPriorityRadio">
    <ToggleIcon icon={faExclamationCircle} selected={value === "high"} bind:value={value} defaultValue="mid" size={size} tooltip="High Importance"/>
    <input type=radio id="highPriorityRadio" bind:group={value} value="high">
  </label>
</div>