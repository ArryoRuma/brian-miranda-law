<script setup lang="ts">
defineProps<{
  step: { number: string; title: string; description: string };
}>();
</script>

<template>
  <div class="process-step">
    <span>{{ step.number }}</span>
    <div>
      <h3>{{ step.title }}</h3>
      <p>{{ step.description }}</p>
    </div>
  </div>
</template>
