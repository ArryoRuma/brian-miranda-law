<script setup lang="ts">
import { Mail, MapPin, MessageCircle, Phone, Smartphone } from "@lucide/vue";
import { getPhoneHref, getTextHref, getWhatsAppHref } from "~/data/routes";

const siteCopy = useSiteCopy();
const site = computed(() => siteCopy.value.site);
const content = computed(() => siteCopy.value.contactPage);
const page = computed(() => {
  const value = siteCopy.value.pages.contact;
  if (!value) throw createError("Contact page content is missing");
  return value;
});
const contact = computed(() => site.value.contact);

const icons = {
  call: Phone,
  text: Smartphone,
  whatsapp: MessageCircle,
  email: Mail,
};
function actionHref(id: "call" | "text" | "whatsapp" | "email") {
  if (id === "call") return getPhoneHref(contact.value.phoneHref);
  if (id === "text") return getTextHref(contact.value.phoneHref);
  if (id === "whatsapp") return getWhatsAppHref(contact.value.phoneHref);
  return `mailto:${contact.value.email}`;
}

const contactActions = computed(() =>
  site.value.contactActions.map(action => ({
    ...action,
    href: actionHref(action.id),
  }))
);

usePageSeo({
  title: page.value.title,
  description: page.value.metaDescription,
  path: page.value.path,
});
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero v-bind="page.hero" />
    <section class="contact-page-section">
      <div class="contact-page-intro">
        <SectionEyebrow tone="dark">{{ content.intro.eyebrow }}</SectionEyebrow>
        <h2>{{ content.intro.title }}</h2>
        <p>{{ content.intro.body }}</p>
        <p class="content-note">{{ content.intro.note }}</p>
      </div>
      <div class="contact-option-grid">
        <a
          v-for="action in contactActions"
          :key="action.id"
          class="contact-option"
          :class="{ 'is-primary': action.priority === 'primary' }"
          :href="action.href"
          :target="action.external ? '_blank' : undefined"
          :rel="action.external ? 'noreferrer' : undefined"
          :aria-label="action.label"
        >
          <component :is="icons[action.id]" :size="22" aria-hidden="true" />
          <span>{{ action.shortLabel }}</span>
          <strong>{{ content.optionValues[action.id] }}</strong>
        </a>
      </div>
    </section>

    <section class="office-section">
      <div>
        <SectionEyebrow>{{ content.office.eyebrow }}</SectionEyebrow>
        <h2>{{ content.office.title }}</h2>
        <p>{{ content.office.body }}</p>
      </div>
      <a
        class="office-address-card"
        :href="contact.mapUrl"
        target="_blank"
        rel="noreferrer"
      >
        <MapPin :size="24" aria-hidden="true" />
        <span
          >{{ contact.addressLines[0] }}<br />{{
            contact.addressLines[1]
          }}</span
        >
      </a>
    </section>
  </div>
</template>
