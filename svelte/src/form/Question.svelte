<script lang="ts">
  import type { Question } from "./questions/structure";
import RangeTemplate from "./questionTemplates/RangeTemplate.svelte";
  export let question: Question;
</script>

{#if question.type === "labelledRange" || question.type === "agreeRange"}
  <RangeTemplate bind:question/>
{/if}