<script lang="ts">
  import RangeInput from "../components/range/LabelledRangeInput.svelte";
  import NextButton from "../components/NextButton.svelte";
  import Underline from "../components/Underline.svelte";
  import Importance from "../components/Importance.svelte";
  import Explanation from "../components/Explanation.svelte";
  import Visibility from "../components/Visibility.svelte";
  import type { RangeQuestion } from "../questions/structure";

  export let question: RangeQuestion;

  let answer: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  let importance: "low" | "mid" | "high";
  let explanation: string;
  let hidden: boolean;

  $: question.answer = {
    value: answer,
    importance,
    explanation,
    hidden
  }


  let questionText: {
    startText?: string;
    underlineLength?: number;
    endText?: string;
  };
  $: questionText = question.type === "labelledRange" ? question.questionText : {
    startText: question.questionText,
    underlineLength: undefined,
    endText: undefined
  }

  let labels: {
    left?: string;
    mid?: string;
    right?: string;
  }
  $: labels = question.type === "labelledRange" ? question.labels : {
    left: "Strongly Disagree",
    right: "Strongly Agree"
  }

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
  <h1>
    {questionText.startText || ""}
    <Underline length={questionText.underlineLength || 0}/>
    {questionText.endText || ""}
  </h1>

  <div style="height: 2em"/>

  <RangeInput bind:sliderValue={answer} labels={labels} bind:cssHeight/>

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
