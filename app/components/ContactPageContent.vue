<script setup lang="ts">
import { Mail, MapPin, MessageCircle, Phone, Smartphone } from "@lucide/vue";
import { getPhoneHref, getTextHref, getWhatsAppHref } from "~/data/routes";
import { buildEditorialPageSchema } from "~~/lib/seo/schema";

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

useSchemaOrg(buildEditorialPageSchema(siteCopy.value, page.value));
</script>

<template>
  <PageShell
    :title="page.title"
    :description="page.metaDescription"
    :path="page.path"
    :show-final-cta="false"
  >
    <section class="contact-page-section contact-layout">
      <div class="contact-overview">
        <div class="contact-page-intro">
          <SectionEyebrow tone="dark">{{
            content.intro.eyebrow
          }}</SectionEyebrow>
          <h1>
            {{ page.hero.title }} <i>{{ page.hero.accent }}</i>
          </h1>
          <p class="contact-intro-lead">{{ page.hero.lead }}</p>
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
      </div>
      <IntakeForm class="contact-inquiry-panel" />
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
  </PageShell>
</template>

<style scoped>
.contact-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(40px, 5vw, 80px);
  padding-block: clamp(40px, 5vw, 72px) clamp(56px, 6vw, 88px);
}
.contact-overview {
  min-width: 0;
}
.contact-page-intro h1 {
  font-size: clamp(40px, 4vw, 58px);
  line-height: 1.08;
  margin-bottom: 22px;
}
.contact-page-intro h1 i {
  color: var(--teal);
}
.contact-page-intro .contact-intro-lead {
  font-size: 19px;
  line-height: 1.65;
  margin-bottom: 32px;
}
.contact-page-intro h2 {
  font-family: "Manrope", sans-serif;
  font-size: 20px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: normal;
  margin-bottom: 12px;
}
.contact-page-intro > p:not(.contact-intro-lead) {
  font-size: 16px;
  line-height: 1.7;
}
.contact-page-intro .content-note {
  margin-bottom: 28px;
  padding: 0;
  border: 0;
  background: transparent;
}
.contact-layout .contact-option-grid {
  margin: 0;
  grid-template-columns: minmax(0, 1fr);
  border: 0;
  border-top: 1px solid var(--color-border-default);
  background: transparent;
  gap: 0;
}
.contact-layout .contact-option {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  column-gap: 14px;
  min-height: 0;
  padding: 16px 0;
  border: 0;
  border-bottom: 1px solid var(--color-border-default);
  background: transparent;
  color: var(--graphite);
}
.contact-layout .contact-option svg {
  grid-row: span 2;
  margin: 3px 0 0;
  color: var(--teal);
}
.contact-layout .contact-option span {
  color: var(--text-muted);
  font-size: 13px;
}
.contact-layout .contact-option strong {
  font-family: "Manrope", sans-serif;
  font-size: 17px;
  font-weight: 700;
  overflow-wrap: anywhere;
  margin-top: 2px;
}
.contact-layout .contact-option:hover strong {
  color: var(--teal);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.contact-layout :deep(.contact-inquiry-panel) {
  width: 100%;
  min-width: 0;
  max-width: none;
  margin: 0;
  padding: clamp(24px, 3vw, 40px);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
  border-top: 3px solid var(--brass);
}
.contact-layout :deep(.contact-inquiry-panel h2) {
  font-size: clamp(30px, 3vw, 40px);
  line-height: 1.15;
  margin-bottom: 16px;
}
.contact-layout :deep(.contact-inquiry-panel > p),
.contact-layout :deep(.intake-form label) {
  font-size: 16px;
  line-height: 1.6;
}
.contact-layout :deep(.intake-form .content-note) {
  margin: 0;
  font-size: 13px;
}
@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }
}
</style>
