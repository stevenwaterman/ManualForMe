<script lang="ts">
  import Importance from "../form-components/importance.svelte";
  import Slider from "../form-components/slider.svelte";
  import Underline from "../form-components/underline.svelte";
  let value: number;
</script>

<style>
  .column {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>

<div class="column">
  <h1>When I feel drained, I prefer to recharge by spending time <Underline length={15}/></h1>
  <Slider bind:value width={25}/>
  <Importance/>
</div>