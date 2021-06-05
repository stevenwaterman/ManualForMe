<script lang="ts">
  import { faExclamationCircle, faBan } from '@fortawesome/free-solid-svg-icons';
  import ToggleIcon from './toggleIcon.svelte';

  let priority: "low" | "mid" | "high" = "mid";
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
  <label>
    <ToggleIcon icon={faBan} selected={priority === "low"} bind:value={priority} defaultValue="mid" size="4x"/>
    <input type=radio bind:group={priority} value="low">
  </label>

  <input type=radio bind:group={priority} value="mid">

  <label>
    <ToggleIcon icon={faExclamationCircle} selected={priority === "high"} bind:value={priority} defaultValue="mid" size="4x"/>
    <input type=radio bind:group={priority} value="high">
  </label>


</div>
{priority}