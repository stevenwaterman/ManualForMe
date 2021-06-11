<script lang="ts">
  import cssVars from 'svelte-css-vars';
  import Slider from './CircleRangeInput.svelte';

  export let sliderValue: number;
  export let sliderMaxWidthPerecent: number = 50;
  export let sliderMaxWidthPx: number = 600;

  let cssWidth: string;
  $: cssWidth = `(min(${sliderMaxWidthPerecent}vw, ${sliderMaxWidthPx}px))`

  export let circleCount: number = 7;

  let widthRatio: number;
  $: widthRatio = Math.max(10, circleCount + 1);

  export let cssHeight: string;
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

  export let labels: {
    left?: string;
    mid?: string;
    right?: string;
  } = {
    left: "Alone",
    mid: "Balanced",
    right: "With others"
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
</style>

<div class="column">
  <div class="labels" use:cssVars={css}>
    <span class="anchor left">
      {labels.left}
    </span>
    <span class="anchor middle">
      {labels.mid}
    </span>
    <span class="anchor right">
      {labels.right}
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
