<script lang="ts">
  const auth = sessionStorage.getItem("auth");

  async function sendRequest() {
    const url = "https://api.manualfor.me";
    const response = await fetch(url, {
      headers: { "Authorization": auth },
      mode: 'no-cors'
    });
    console.log(response);
  }
</script>

<h1>Home</h1>

{#if auth}
  Welcome back

  <button on:click={sendRequest}>Send Request</button>
{:else}
  <!-- TODO pass in the client_id via props -->
  <a href={`https://auth2.manualfor.me/signup?client_id=c0vhj2cc0khihdn1ihs0037fq&response_type=code&scope=email+openid+profile&redirect_uri=${window.location.origin}/authSuccess`}>Sign Up</a>
  <a href={`https://auth2.manualfor.me/login?client_id=c0vhj2cc0khihdn1ihs0037fq&response_type=code&scope=email+openid+profile&redirect_uri=${window.location.origin}/authSuccess`}>Log In</a>
{/if}