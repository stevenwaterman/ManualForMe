<script lang="ts">
  export let length: number = 10;
  $: spaces = " ".repeat(length)
</script>

<style>
  .underline {
    text-decoration: underline;
    white-space: pre;
  }
</style>

<span class="underline">{spaces}</span>