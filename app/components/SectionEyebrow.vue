<script setup lang="ts">
withDefaults(defineProps<{ tone?: "light" | "dark" }>(), {
  tone: "light",
});
</script>

<template>
  <p class="eyebrow" :class="{ dark: tone === 'dark' }">
    <span class="eyebrow-rule" />
    <slot />
  </p>
</template>
