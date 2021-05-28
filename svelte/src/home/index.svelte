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

  const clientId = "4fv92a6925ibl0h2uh98ibnkep";
</script>

<h1>Home</h1>

{#if auth}
  Welcome back

  <button on:click={sendRequest}>Send Request</button>
  <button on:click={signOut}>Sign Out</button>
{:else}
  <!-- TODO pass in the client_id via props -->
  <a href={`https://credentials.manualfor.me/signup?client_id=${clientId}&response_type=token&scope=email+openid+profile&redirect_uri=${window.location.origin}/authSuccess`}>Sign Up</a>
  <a href={`https://credentials.manualfor.me/login?client_id=${clientId}&response_type=token&scope=email+openid+profile&redirect_uri=${window.location.origin}/authSuccess`}>Log In</a>
{/if}
