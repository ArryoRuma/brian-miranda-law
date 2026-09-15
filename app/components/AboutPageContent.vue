<script setup lang="ts">
import type { SitePageContent } from "~/types/content";
import { getWhatsAppHref } from "~/data/routes";

const props = defineProps<{ content: SitePageContent }>();
const siteCopy = useSiteCopy();
const { localizePath } = useSiteLocale();
const biography = computed(() =>
  props.content.sections.filter(section => section.id === "background")
);
const credentials = computed(() =>
  props.content.sections.filter(
    section => section.id === "education" || section.id === "admissions"
  )
);
const remaining = computed(() =>
  props.content.sections.filter(
    section =>
      !["background", "education", "admissions"].includes(section.id ?? "")
  )
);
const whatsapp = computed(() =>
  siteCopy.value.site.contactActions.find(action => action.id === "whatsapp")!
);

usePageSeo({
  title: props.content.title,
  description: props.content.metaDescription,
  path: props.content.path,
});
</script>

<template>
  <div class="about-page">
    <Breadcrumbs />
    <section class="about-intro">
      <div class="about-intro-copy">
        <SectionEyebrow tone="dark">{{ content.hero.eyebrow }}</SectionEyebrow>
        <h1>{{ content.hero.title }}</h1>
        <p>{{ content.hero.lead }}</p>
        <NuxtLink
          v-if="content.hero.secondaryHref && content.hero.secondaryLabel"
          class="about-consultation"
          :to="localizePath(content.hero.secondaryHref)"
        >
          {{ content.hero.secondaryLabel }}
        </NuxtLink>
      </div>
      <div class="about-portrait">
        <NuxtImg
          :src="content.hero.image"
          :alt="content.hero.imageAlt"
          width="1352"
          height="1082"
          sizes="xs:100vw md:40vw lg:480px"
          loading="eager"
          fetchpriority="high"
        />
      </div>
    </section>

    <div class="about-background">
      <div class="about-biography">
        <PageSectionRenderer
          v-for="section in biography"
          :key="section.id"
          :section="section"
        />
      </div>
      <aside class="about-credentials">
        <PageSectionRenderer
          v-for="section in credentials"
          :key="section.id"
          :section="section"
        />
      </aside>
    </div>

    <div class="about-details">
      <PageSectionRenderer
        v-for="section in remaining"
        :key="section.id"
        :section="section"
      />
    </div>

    <section v-if="content.finalCta" class="about-closing">
      <div>
        <h2>{{ content.finalCta.title }}</h2>
        <p>{{ content.finalCta.body }}</p>
      </div>
      <div class="about-closing-actions">
        <NuxtLink
          v-if="content.hero.secondaryHref && content.hero.secondaryLabel"
          class="about-consultation"
          :to="localizePath(content.hero.secondaryHref)"
          >{{ content.hero.secondaryLabel }}</NuxtLink
        >
        <div class="about-contact-links">
          <ContactActions compact />
          <a
            :href="getWhatsAppHref(siteCopy.site.contact.phoneHref)"
            :aria-label="whatsapp.label"
            >{{ whatsapp.shortLabel }}</a
          >
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  background: var(--color-surface-light);
  color: var(--color-surface-dark);
}
.about-intro,
.about-background,
.about-details,
.about-closing {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(24px, 5vw, 64px);
}
.about-intro {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
  padding-block: 48px 72px;
}
.about-intro h1 {
  font-size: clamp(2.75rem, 4.8vw, 4.5rem);
  line-height: 1.06;
  margin-block: 24px;
  max-width: 9ch;
}
.about-intro p,
.about-closing p {
  font-size: 1.0625rem;
  line-height: 1.8;
  max-width: 60ch;
}
.about-consultation {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  padding: 14px 22px;
  background: var(--color-brand-primary);
  color: var(--color-surface-dark);
  font-size: 1.1875rem;
  font-weight: 700;
  line-height: 1.4;
  text-decoration: none;
}
.about-intro .about-consultation {
  margin-top: 28px;
}
.about-consultation:hover {
  background: var(--color-brand-primary-hover);
}
.about-page a:focus-visible {
  outline: 3px solid var(--color-surface-dark);
  outline-offset: 5px;
}
.about-portrait {
  border-bottom: 4px solid var(--color-brand-primary);
}
.about-portrait img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 50% 35%;
}
.about-background {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: clamp(32px, 6vw, 88px);
  padding-block: 12px 72px;
  align-items: start;
}
.about-credentials {
  background: var(--color-surface-warm);
  padding: 28px;
}
.about-credentials :deep(.check-list-icon) {
  display: none;
}
.about-credentials :deep(.check-list) {
  margin: 16px 0 0;
}
.about-credentials :deep(.check-list li) {
  display: block;
  min-height: 0;
  padding: 10px 0;
  font-size: 0.9375rem;
  line-height: 1.65;
}
.about-credentials :deep(section + section) {
  margin-top: 30px;
}
.about-page :deep(.content-section) {
  display: block;
  padding: 0;
  background: transparent;
  color: inherit;
}
.about-page :deep(.content-section-body) {
  margin-top: 24px;
  border: 0;
  display: block;
  max-width: none;
  padding: 0;
}
.about-page :deep(h2) {
  font-size: clamp(1.9rem, 3vw, 2.7rem);
  line-height: 1.2;
}
.about-credentials :deep(h2) {
  font-size: 1.5rem;
}
.about-page :deep(.narrative-copy) {
  max-width: 65ch;
}
.about-page :deep(.narrative-copy p) {
  font-size: 1.0625rem;
  line-height: 1.85;
}
.about-details :deep(.content-section) {
  padding-block: 48px;
  border-top: 1px solid var(--color-border-brand);
}
.about-details :deep(.editorial-card-grid) {
  background: transparent;
  border: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.about-details :deep(.editorial-card) {
  min-height: 0;
  border: 0;
  border-top: 1px solid var(--color-border-brand);
  padding: 24px 0 0;
  background: transparent;
}
.about-details :deep(.content-card-number) {
  display: none;
}
.about-closing {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: center;
  padding-block: 48px 64px;
  border-top: 1px solid var(--color-border-brand);
}
.about-closing h2 {
  margin-bottom: 16px;
}
.about-closing-actions {
  display: grid;
  gap: 20px;
  justify-items: start;
}
.about-contact-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.about-contact-links :deep(.contact-action-text) {
  color: var(--color-text-dark);
  border-color: var(--color-border-brand);
}
.about-contact-links :deep(.contact-action-text:hover) {
  background: var(--color-surface-warm);
}
.about-contact-links > a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: inherit;
  text-underline-offset: 4px;
}
@media (max-width: 900px) {
  .about-background {
    grid-template-columns: 1.2fr 1fr;
    gap: 32px;
  }
  .about-details :deep(.editorial-card-grid) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .about-closing {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 600px) {
  .about-intro,
  .about-background {
    grid-template-columns: 1fr;
  }
  .about-intro {
    padding-block: 28px 40px;
  }
  .about-intro h1 {
    max-width: 11ch;
  }
  .about-portrait {
    max-width: 440px;
  }
  .about-background {
    padding-bottom: 40px;
  }
  .about-details :deep(.content-section) {
    padding-block: 32px;
  }
  .about-consultation {
    text-align: center;
  }
}
</style>
