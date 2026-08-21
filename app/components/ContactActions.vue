<script setup lang="ts">
import { MessageSquareText, Phone } from "@lucide/vue";
import { getPhoneHref, getTextHref, getWhatsAppHref } from "~/data/routes";

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

const siteCopy = await useSiteCopy();
const site = computed(() => siteCopy.value.site);

function actionHref(id: "call" | "text" | "whatsapp" | "email") {
  const contact = site.value.contact;
  if (id === "call") return getPhoneHref(contact.phoneHref);
  if (id === "text") return getTextHref(contact.phoneHref);
  if (id === "whatsapp") return getWhatsAppHref(contact.phoneHref);
  return `mailto:${contact.email}`;
}

const callAction = computed(() => {
  const action = site.value.contactActions.find(item => item.id === "call")!;
  return { ...action, href: actionHref(action.id) };
});
const textAction = computed(() => {
  const action = site.value.contactActions.find(item => item.id === "text")!;
  return { ...action, href: actionHref(action.id) };
});
</script>

<template>
  <div
    class="primary-contact-actions"
    :class="{ 'is-compact': compact }"
    :aria-label="site.shared.contactActionsAriaLabel"
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
