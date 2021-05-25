<script lang="ts">
  import useQuery from "../useQuery";
  import { navigate } from "svelte-navigator";
  const codeStore = useQuery("code");
  codeStore.subscribe(code => {
    sessionStorage.setItem("auth", code as string);
    navigate("/");
  })
</script>