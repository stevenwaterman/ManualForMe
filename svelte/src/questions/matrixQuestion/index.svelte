<script lang="ts">
  import NextButton from "../../form-components/nextButton.svelte";
  import Explanation from "../../form-components/explanation.svelte";
  import Visibility from "../../form-components/visibility.svelte";
  import Matrix from "../../form-components/matrix/index.svelte";

  export let xValues: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  export let yValues: string[] = ["0-1", "1-2", "2-3", "3-4", "4-5", "6-7", "7-8", "8-9", "9-10", "10-11", "11-12", "12-13", "13-14", "14-15", "15-16", "16-17", "17-18", "18-19", "19-20", "20-21", "21-22", "22-23", "23-24"];

  let value: {
    x: string;
    y: string;
    value: "cross" | "blank" | "tick"
  }[];
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
  <h1>What are your working hours?</h1>

  <div style="height: 2em"/>

  <Matrix xValues={xValues} yValues={yValues} bind:value/>

  <div style="height: 2em"/>

  <div class="row" style="width: 50%">
    <Explanation bind:explanation/>
  </div>

  <div style="height: 4em"/>

  <div class="row" style="">
    <Visibility bind:hidden size={cssHeight}/>

    <div style="width: 4em"/>

    <NextButton/>
  </div>
</div>

