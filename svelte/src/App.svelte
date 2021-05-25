<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import Home from "./home/index.svelte";
  import AuthSuccess from './authSuccess/index.svelte';
  import NotFound from "./notFound/index.svelte";
</script>

<Router>
  <Route path="/" component={Home}/>
  <Route path="authSuccess" component={AuthSuccess}/>
  <Route component={NotFound}/>
</Router>