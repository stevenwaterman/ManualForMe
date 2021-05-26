<script lang="ts">
  import { useHash } from "../useQuery";
  import { Link } from "svelte-navigator";
  
  const codeStore = useHash("id_token");
  let code: string;
  $: code = $codeStore as string;

  $: if (code) sessionStorage.setItem("auth", code);
</script>

{#if code}
  <h1>Successfully logged in</h1>
{:else}
  <h1>Failed to log in</h1>
{/if}

<Link to="/">Go back</Link>