<script lang="ts">
  let auth: string | null = sessionStorage.getItem("auth");

  function signOut() {
    sessionStorage.removeItem("auth");
    auth = null;
  }

  async function sendRequest() {
    const promise = fetch("https://manualfor.me/api/", {
      headers: { "Authorization": auth },
      mode: 'cors'
    });
    const response = await promise;
    console.log(response);
  }
</script>

<h1>Home</h1>

{#if auth}
  Welcome back

  <button on:click={sendRequest}>Send Request</button>
  <button on:click={signOut}>Sign Out</button>
{:else}
  <!-- TODO pass in the client_id via props -->
  <a href={`https://manualfor.me/api/signup?redirect=${window.location.origin}`}>Sign Up</a>
  <a href={`https://manualfor.me/api/login?redirect=${window.location.origin}`}>Log In</a>
{/if}
