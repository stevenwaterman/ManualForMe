<script lang="ts">
  import ImportanceSlider from "../form-components/importanceSlider.svelte";
import NextButton from "../form-components/nextButton.svelte";
  import Underline from "../form-components/underline.svelte";
  let value: {
    slider: number;
    importance: "low" | "mid" | "high";
  };
</script>

<style>
  .column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  h1 {
    margin-bottom: 2em;
    margin-left: 1em;
    margin-right: 1em;
  }
</style>

<div class="column">
  <h1>When I feel drained, I prefer to recharge by spending time <Underline length={15}/></h1>
  <ImportanceSlider bind:value/>
</div>
