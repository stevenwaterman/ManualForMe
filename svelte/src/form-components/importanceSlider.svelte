<script lang="ts">
  import cssVars from 'svelte-css-vars';
  import Importance from './importance.svelte';
  import Slider from './slider.svelte';
  import NextButton from './nextButton.svelte';

  export let sliderValue: number;
  export let importanceValue: "low" | "mid" | "high";
  export let value: {
    slider: number;
    importance: "low" | "mid" | "high";
  }
  $: value = {
    slider: sliderValue,
    importance: importanceValue
  }

  export let sliderMaxWidthPerecent: number = 50;
  export let sliderMaxWidthPx: number = 600;

  let cssWidth: string;
  $: cssWidth = `(min(${sliderMaxWidthPerecent}vw, ${sliderMaxWidthPx}px))`

  export let circleCount: number = 7;

  let widthRatio: number;
  $: widthRatio = Math.max(10, circleCount + 1);

  let cssHeight: string;
  $: cssHeight = `(${cssWidth} / ${widthRatio})`;

  let cssCircleDiameter: string;
  $: cssCircleDiameter = cssHeight;

  let cssCircleRadius: string;
  $: cssCircleRadius = `(${cssWidth} / ${widthRatio * 2})`;

  let cssWidthUsedForCircles: string;
  $: cssWidthUsedForCircles = `(${cssCircleDiameter} * ${circleCount})`;

  let connectors: number;
  $: connectors = circleCount - 1;

  let cssWidthUsedForConnectors: string;
  $: cssWidthUsedForConnectors = `(${cssWidth} - ${cssWidthUsedForCircles})`;

  let cssConnectorWidth: string;
  $: cssConnectorWidth = `(${cssWidthUsedForConnectors} / ${connectors})`;

  let cssSectionWidth: string;
  $: cssSectionWidth = `(${cssCircleDiameter} + ${cssConnectorWidth})`;

  $: css = {
    width: cssWidth,
    circleRadius: cssCircleRadius
  }

  const labels = {
    min: "Alone",
    mid: "Balanced",
    max: "With others"
  }

  // TODO make the SPAN elements into labels
  // TODO use responsive sizing, max of % and px amount
  // TODO check it works for different number of circles
</script>

<style>
  .labels {
    width: calc(var(--width));
    height: 24pt;
    position: relative;
  }

  .anchor {
    position: absolute;
    top: 0;
    bottom: 0;
    text-align: center;
    user-select: none;
    font-size: 16pt;
  }

  .left {
    left: calc(var(--circleRadius));
    transform: translateX(-50%);
  }

  .middle {
    left: 50%;
    transform: translateX(-50%);
  }

  .right {
    right: calc(var(--circleRadius));
    transform: translateX(50%);
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
  }
</style>

<div class="row">
  <div class="column">
    <div class="labels" use:cssVars={css}>
      <span class="anchor left">
        {labels.min}
      </span>
      <span class="anchor middle">
        {labels.mid}
      </span>
      <span class="anchor right">
        {labels.max}
      </span>
    </div>
      <Slider
        min={Math.floor(- (circleCount - 1) / 2)} 
        max={Math.floor(circleCount / 2)}
        width={cssWidth}
        height={cssHeight}
        sectionWidth={cssSectionWidth}
        circleRadius={cssCircleRadius}
        bind:value={sliderValue}
      />
  </div>

  <div style={`width: calc(${cssConnectorWidth} * 2)`}/>

  <div class="column">
    <div class="labels" use:cssVars={{width: "0px"}}>
      <span class="anchor middle">Importance</span>
    </div>
    <Importance bind:value={importanceValue} size={cssHeight} separation={`calc(${cssConnectorWidth} / 2)`}/>
  </div>

  <div style={`width: calc(${cssConnectorWidth} * 2)`}/>
  
  <NextButton/>
</div>
