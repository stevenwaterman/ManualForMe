<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";
  import Home from "./home/index.svelte";
  import Hi from "./hi/index.svelte";
  import NotFound from "./notfound/index.svelte";
</script>

<h1>Hello</h1>

<Router>
  <Route path="/" component={Home}/>
  <Route path="hi" component={Hi}/>
  <Route component={NotFound}/>
</Router>