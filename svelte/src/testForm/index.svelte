<script lang="ts">
  import RangeInput from "../form-components/range/labelledRangeInput.svelte";
  import NextButton from "../form-components/nextButton.svelte";
  import Underline from "../form-components/underline.svelte";
  import Importance from "../form-components/importance.svelte";
import Explanation from "../form-components/explanation.svelte";
import Visibility from "../form-components/visibility.svelte";

  let answer: number;
  let importance: "low" | "mid" | "high";
  let explanation: string;
  let hidden: boolean;

  let cssHeight: string;
</script>

<style>
  .column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-size: 16pt;
  }

  .row {
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content: space-evenly;
    align-items: flex-end;
  }

  h1 {
    text-align: center;
  }
</style>

<div class="column">
  <h1>When I feel drained, I prefer to recharge by spending time <Underline length={15}/></h1>

  <div style="height: 2em"/>

  <RangeInput bind:sliderValue={answer} bind:cssHeight/>

  <div style="height: 4em"/>

  <div class="row" style="width: 50%">
    <Explanation bind:explanation/>
  </div>

  <div style="height: 4em"/>

  <div class="row" style="">
    <Visibility bind:hidden size={cssHeight}/>

    <div style="width: 4em"/>

    <Importance bind:importance size={cssHeight} separation="1em"/>

    <div style="width: 4em"/>

    <NextButton/>
  </div>
</div>
