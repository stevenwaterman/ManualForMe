<script lang="ts">
  import type {Section} from "./questions/structure";
  import Question from "./Question.svelte";
  export let section: Section;
</script>

{#each section.questions as question}
  <Question bind:question/>
{/each}