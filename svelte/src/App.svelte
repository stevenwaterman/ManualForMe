<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import Home from "./home/index.svelte";
  import AuthSuccess from './authSuccess/index.svelte';
  import NotFound from "./notFound/index.svelte";
  import Slider from "./form-components/slider.svelte";
  import cssVars from 'svelte-css-vars';
  import { colors } from './colors';

  let value: number;
</script>

<style>
  :global(body) {
    background-color: #faf5f7;
  }
</style>

<main use:cssVars={colors}>
  <Router>
    <Route path="/" component={Home}/>
    <Route path="authSuccess" component={AuthSuccess}/>
    <Route component={NotFound}/>
  </Router>
  
  <br>
  
  <Slider bind:value/>
  
  <p>{value}</p>
</main>
