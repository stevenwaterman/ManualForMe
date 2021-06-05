<script lang="ts">
  import cssVars from 'svelte-css-vars';

  export let value: number = 0;
  export let width: number = 50;
  export let circleCount: number = 7;
  $: height = width / Math.max(10, circleCount + 1);
  $: circleDiameter = height;
  $: widthUsedForCircles = circleDiameter * circleCount;
  $: connectors = circleCount - 1;
  $: widthUsedForConnectors = width - widthUsedForCircles;
  $: connectorWidth = widthUsedForConnectors / connectors;
  $: sectionWidth = circleDiameter + connectorWidth;

  $: css = {
    width: `${width}vw`,
    height: `${height}vw`,
    bgWidth: `${sectionWidth}vw`,
    circleRadius: `${circleDiameter/2}vw`
  }

  const labels = {
    min: "Alone",
    mid: "Balanced",
    max: "With others"
  }

  // TODO make the SPAN elements into labels
  // TODO fix styling on non-chrome browsers
  // TODO use responsive sizing, max of % and px amount
  // TODO check it works for different number of circles
</script>

<style>
  input[type=range] {
    -webkit-appearance: none;
    border: none;
    cursor: pointer;
    background-image: 
      radial-gradient(
        closest-side circle at center, 
        white calc(99% - 3px), 
        var(--border) calc(99% - 2px),
        var(--border) calc(100% - 1px), 
        transparent 100%
      ),
      radial-gradient(
        closest-side circle at center, 
        var(--background) 105%,
        transparent calc(105% + 2px)
      ),
      linear-gradient(
        var(--background) calc(49.5% - 1.5px), 
        var(--border) 49.5%, 
        var(--border) 50.5%, 
        var(--background) calc(50.5% + 1.5px)
      );
    background-position: center;
    background-repeat: repeat-x;
    background-size: var(--bgWidth) var(--height);
    width: var(--width);
    height: var(--height);
    outline: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /*Chrome*/
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: var(--height);
    width: var(--height);
    background-image: 
      radial-gradient(
        closest-side circle at center, 
        var(--highlight) calc(90% - 4px), 
        transparent calc(90% - 2px)
      );
    background-position: center;
    background-size: 100% 100%;
    cursor: col-resize;
  }

  input[type=range]:focus::-webkit-slider-thumb {
  }








  /*Firefox*/
  input[type=range]::-moz-range-thumb {
    height: 27px;
    width: 15px;
    background: linear-gradient(to right, #ffffff 0%, #ffffff 39%, #ffbdd7 39%, #ffbdd7 61%, #ffffff 61%, #ffffff 100%) 0 no-repeat;
    border-radius: 4px;
    background-size: 100% 17px;
    border: none;
    box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.5);
  }
  input[type=range]::-moz-range-track {
    background: none;
  }
  /*IE 11 and Edge*/
  input[type=range]::-ms-track {
    color: transparent;
    background: none;
    border: none;
  }
  input[type=range]::-ms-thumb {
    height: 27px;
    width: 15px;
    background: linear-gradient(to right, #ffffff 0%, #ffffff 39%, #ffbdd7 39%, #ffbdd7 61%, #ffffff 61%, #ffffff 100%) 0 no-repeat;
    border-radius: 4px;
    background-size: 100% 17px;
    border: none;
    margin-top: 3px;
    box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.5);
  }
  input[type=range]::-ms-fill-lower {
    background: none;
  }
  input[type=range]::-ms-fill-upper {
    background: none;
  }




  .labels {
    width: var(--width);
    height: 20px;
    position: relative;
  }

  .anchor {
    position: absolute;
    height: 20px;
    top: 0;
    bottom: 0;
    text-align: center;
  }

  .left {
    left: var(--circleRadius);
    transform: translateX(-50%);
  }

  .middle {
    left: 50%;
    transform: translateX(-50%);
  }

  .right {
    right: var(--circleRadius);
    transform: translateX(50%);
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>

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
  <input 
    type="range" 
    min={Math.floor(- (circleCount - 1) / 2)} 
    max={Math.floor(circleCount / 2)} 
    step="1" 
    bind:value use:cssVars={css}
  />
</div>

