<script lang="ts">
  import cssVars from 'svelte-css-vars';

  export let value: number = 0

  const width: number = 50;
  const css = {
    width: `${width}vw`,
    height: `${width/10}vw`,
    bgSize: `${width/7}vw ${width/7}vw`,
    padding: `calc(${width/50}vw + 1px)`
  }

  const labels = {
    min: "Alone",
    mid: "Balanced",
    max: "With others"
  }
</script>

<style>
  input[type=range] {
    -webkit-appearance: none;
    border: none;
    cursor: pointer;
    background-image: radial-gradient(ellipse at center, var(--background) calc(40% - 1px), var(--border) 40%, var(--border) calc(40% + 1px), transparent calc(40% + 2px)), linear-gradient(var(--background) calc(50% - 1.5px), var(--border) 50%, var(--background) calc(50% + 1.5px));
    background-position: center;
    background-repeat: repeat-x;
    background-size: var(--bgSize);
    width: var(--width);
    height: var(--height);
    outline: 0;
    margin: 0;
    box-sizing: border-box;
    padding: var(--padding);
  }

  /*Chrome*/
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: var(--height);
    width: var(--height);
    background-image: radial-gradient(ellipse at center, var(--highlight) 48%, transparent 50%);
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
    display: flex;
    flex-direction: row;
    width: var(--width);
    justify-content: space-between;
    height: 20px;
  }

  .labelWrapper {
    flex-basis: 0;
    flex: 1 1 0;
    position: relative;
  }

  .label {
    position: absolute;
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }
</style>

<div class="labels" use:cssVars={css}>
  <div class="labelWrapper"><span class="label">{labels.min}</span></div>
  <div class="labelWrapper"></div>
  <div class="labelWrapper"></div>
  <div class="labelWrapper"><span class="label">{labels.mid}</span></div>
  <div class="labelWrapper"></div>
  <div class="labelWrapper"></div>
  <div class="labelWrapper"><span class="label">{labels.max}</span></div>
</div>
<input type="range" min="-3" max="3" step="1" bind:value use:cssVars={css}/>