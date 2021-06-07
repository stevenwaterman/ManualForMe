<script lang="ts">
  import cssVars from 'svelte-css-vars';

  export let value: number = 0;

  export let width: string;
  export let height: string;
  export let sectionWidth: string;
  export let circleRadius: string;
  
  export let min: number;
  export let max: number;

  $: css = {
    width,
    height,
    sectionWidth,
    circleRadius
  }

  // TODO fix styling on non-chrome browsers
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
    background-size: calc(var(--sectionWidth)) calc(var(--height));
    width: calc(var(--width));
    height: calc(var(--height));
    outline: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /*Chrome*/
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: calc(var(--height));
    width: calc(var(--height));
    background-image: 
      radial-gradient(
        closest-side circle at center, 
        var(--highlight) calc(70% - 4px), 
        transparent calc(70% - 2px)
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
</style>

<input 
  type="range" 
  min={min} 
  max={max}
  step="1" 
  bind:value
  use:cssVars={css}
/>

