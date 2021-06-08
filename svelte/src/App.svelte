<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import Home from "./home/index.svelte";
  import AuthSuccess from './authSuccess/index.svelte';
  import NotFound from "./notFound/index.svelte";
  import MatrixQuestion from "./questions/matrixQuestion/index.svelte";
  import cssVars from 'svelte-css-vars';
  import { colors } from './colors';

  let value: number;
</script>

<style>
  :global(body) {
    background-color: #faf5f7;
    overflow-x: hidden;
  }

  .container {
    color: var(--text);
    width: min(1200px, 80%);
    margin: auto;
  }
</style>

<main use:cssVars={colors}>
  <div class="container">
    <Router>
      <Route path="/" component={Home}/>
      <Route path="authSuccess" component={AuthSuccess}/>
      <Route path="form" component={MatrixQuestion}/>
      <Route component={NotFound}/>
    </Router>
  </div>
</main>
