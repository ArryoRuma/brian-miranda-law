<script setup lang="ts">
import { MessageSquareText, Phone } from "@lucide/vue";
import { CONTACT_ACTIONS } from "~/data/site";

withDefaults(
  defineProps<{
    compact?: boolean;
    callLabel?: string;
    textLabel?: string;
  }>(),
  {
    compact: false,
    callLabel: undefined,
    textLabel: undefined,
  }
);

const callAction = CONTACT_ACTIONS[0];
const textAction = CONTACT_ACTIONS[1];
</script>

<template>
  <div
    class="primary-contact-actions"
    :class="{ 'is-compact': compact }"
    aria-label="Contact Brian Miranda"
  >
    <a
      class="contact-action contact-action-call"
      :href="callAction.href"
      :aria-label="callAction.label"
    >
      <Phone :size="18" aria-hidden="true" />
      <span>{{ callLabel ?? callAction.shortLabel }}</span>
    </a>
    <a
      class="contact-action contact-action-text"
      :href="textAction.href"
      :aria-label="textAction.label"
    >
      <MessageSquareText :size="18" aria-hidden="true" />
      <span>{{ textLabel ?? textAction.shortLabel }}</span>
    </a>
  </div>
</template>
