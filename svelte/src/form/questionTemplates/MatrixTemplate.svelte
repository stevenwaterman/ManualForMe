<script lang="ts">
  import NextButton from "../components/NextButton.svelte";
  import Explanation from "../components/Explanation.svelte";
  import Visibility from "../components/Visibility.svelte";
  import Matrix from "../components/matrix/Index.svelte";
import ThreeStateButton from "../components/matrix/ThreeStateButton.svelte";

  export let xValues: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  export let yValues: string[] = Array(24).fill(null).map((_, idx) => `${idx} - ${idx + 1}`);

  let value: {
    x: string;
    y: string;
    value: "cross" | "blank" | "tick"
  }[];
  let explanation: string = "";
  let hidden: boolean;

  let cssHeight: string;
</script>

<style>
  .info {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1em;
    justify-content: center;
    align-items: center;
  }

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

  <div class="info">
    <ThreeStateButton disabled value="blank"/>

    <span>Default state: Sometimes I am working.</span>

    <ThreeStateButton disabled value="tick"/>

    <span>Left click: 90% chance I am working.</span>

    <ThreeStateButton disabled value="cross"/>

    <span>Right click: 90% chance I am <emph>not</emph> working.</span>
  </div>

  <div style="height: 2em"/>

  <Matrix xValues={xValues} yValues={yValues} bind:value/>

  <div style="height: 2em"/>

  <div class="row" style="width: 50%">
    <Explanation bind:explanation/>
  </div>

  <div style="height: 2em"/>

  <div class="row" style="">
    <Visibility bind:hidden size="50px"/>

    <div style="width: 4em"/>

    <NextButton/>
  </div>
</div>

