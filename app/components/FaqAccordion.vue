<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: readonly { question: string; answer: string }[];
    idPrefix?: string;
    initialOpen?: number | null;
  }>(),
  {
    idPrefix: "faq-answer",
    initialOpen: 0,
  }
);

const openIndex = ref<number | null>(props.initialOpen);
</script>

<template>
  <div class="faq-list">
    <div
      v-for="(item, index) in items"
      :key="item.question"
      class="faq-item"
      :class="{ 'is-open': openIndex === index }"
    >
      <button
        type="button"
        :aria-expanded="openIndex === index"
        :aria-controls="`${idPrefix}-${index}`"
        @click="openIndex = openIndex === index ? null : index"
      >
        <span>{{ item.question }}</span>
        <span aria-hidden="true">{{ openIndex === index ? "−" : "+" }}</span>
      </button>
      <p v-if="openIndex === index" :id="`${idPrefix}-${index}`">
        {{ item.answer }}
      </p>
    </div>
  </div>
</template>
