<script lang="ts">
  export let explanation: string;
</script>

<style>
  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }

  span {
    text-align: center;
    margin-bottom: .5em;
  }

  textarea {
    font-size: 12pt;
    height: calc(var(--height));
    margin: 0;
    resize: none;
  }
</style>

<div class="column">
  <span>Explanation</span>
  <textarea rows=3 bind:value={explanation} maxlength=200 placeholder="Use this space to add more detail to your answer, if needed"/>
</div>