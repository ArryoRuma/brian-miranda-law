<script setup lang="ts">
import {
  ArrowUpRight,
  Languages,
  Scale,
  ShieldCheck,
  Star,
  UserRound,
} from "@lucide/vue";

const siteCopy = await useSiteCopy();
const content = computed(() => siteCopy.value.home);
const site = computed(() => siteCopy.value.site);
const contact = computed(() => site.value.contact);
const structuredData = computed(() => site.value.structuredData);

usePageSeo({
  title: content.value.seo.title,
  description: content.value.seo.description,
  path: "/",
});

useSchemaOrg([
  {
    "@type": "LegalService",
    "@id": `${site.value.url}/#legal-service`,
    name: contact.value.name,
    alternateName: contact.value.shortName,
    url: site.value.url,
    image: `${site.value.url}${content.value.hero.image}`,
    telephone: contact.value.phoneHref,
    email: contact.value.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: structuredData.value.streetAddress,
      addressLocality: structuredData.value.addressLocality,
      addressRegion: structuredData.value.addressRegion,
      postalCode: structuredData.value.postalCode,
      addressCountry: structuredData.value.addressCountry,
    },
    areaServed: structuredData.value.areaServed,
    knowsLanguage: structuredData.value.knowsLanguage,
  },
  {
    "@type": "Person",
    "@id": `${site.value.url}/#brian-miranda`,
    name: contact.value.attorney,
    jobTitle: structuredData.value.attorneyJobTitle,
    worksFor: { "@id": `${site.value.url}/#legal-service` },
  },
  {
    "@type": "FAQPage",
    mainEntity: content.value.faq.items.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
]);
</script>

<template>
  <div>
    <section id="top" class="hero-section">
      <div class="hero-copy">
        <SectionEyebrow>{{ content.hero.eyebrow }}</SectionEyebrow>
        <h1>
          {{ content.hero.title }}
          <br />
          <i>{{ content.hero.accent }}</i>
        </h1>
        <p class="hero-lede">{{ content.hero.lead }}</p>
        <div class="hero-actions">
          <ContactActions />
          <a class="text-link" href="#process">
            {{ content.hero.processLabel }}
            <ArrowUpRight :size="16" aria-hidden="true" />
          </a>
        </div>
        <p class="hero-note">
          <ShieldCheck :size="16" aria-hidden="true" />
          {{ content.hero.note }}
        </p>
      </div>
      <div class="hero-image-wrap">
        <NuxtImg
          :src="content.hero.image"
          :alt="content.hero.imageAlt"
          class="hero-image"
          width="1920"
          height="1280"
          sizes="xs:100vw md:51vw"
          format="webp"
          loading="eager"
          fetchpriority="high"
          preload
        />
        <div class="image-caption">
          <span>{{ content.hero.captionPrimary }}</span>
          <span>{{ content.hero.captionSecondary }}</span>
        </div>
      </div>
      <div class="hero-index">
        {{ content.hero.indexCurrent }}
        <span>{{ content.hero.indexSeparator }}</span>
        {{ content.hero.indexTotal }}
      </div>
    </section>

    <section class="home-trust-strip" :aria-label="content.trustStripAriaLabel">
      <span v-for="item in content.trustStrip" :key="item">{{ item }}</span>
    </section>

    <section id="services" class="services-section">
      <div class="section-heading-row">
        <div>
          <SectionEyebrow tone="dark">{{
            content.services.eyebrow
          }}</SectionEyebrow>
          <h2>{{ content.services.title }}</h2>
        </div>
        <p class="section-aside">{{ content.services.aside }}</p>
      </div>
      <div class="services-list">
        <ServiceCard
          v-for="service in content.services.items"
          :key="service.number"
          :service="service"
        />
      </div>
    </section>

    <section id="process" class="process-section">
      <div class="process-image">
        <NuxtImg
          :src="content.process.image"
          :alt="content.process.imageAlt"
          width="1536"
          height="1920"
          sizes="xs:100vw md:39vw"
          format="webp"
          loading="lazy"
        />
      </div>
      <div class="process-copy">
        <SectionEyebrow tone="dark">{{
          content.process.eyebrow
        }}</SectionEyebrow>
        <h2>
          {{ content.process.title }}
          <br />
          <em>{{ content.process.accent }}</em>
        </h2>
        <div class="process-steps">
          <ProcessStep
            v-for="step in content.process.steps"
            :key="step.number"
            :step="step"
          />
        </div>
      </div>
    </section>

    <section class="home-about-section">
      <div class="home-about-mark" aria-hidden="true">
        <UserRound :size="35" />
        <span>{{ content.about.mark }}</span>
      </div>
      <div>
        <SectionEyebrow tone="dark">{{ content.about.eyebrow }}</SectionEyebrow>
        <h2>{{ content.about.title }}</h2>
        <p>{{ content.about.body }}</p>
        <NuxtLink class="text-link dark-link" :to="content.about.href">
          {{ content.about.linkLabel }}
          <ArrowUpRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <section class="home-language-section">
      <div>
        <Languages :size="32" aria-hidden="true" />
        <SectionEyebrow>{{ content.languages.eyebrow }}</SectionEyebrow>
        <h2>{{ content.languages.title }}</h2>
        <p>{{ content.languages.body }}</p>
      </div>
      <div class="language-card-grid">
        <LanguageLink
          v-for="language in content.languages.items"
          :key="language.href"
          :code="language.label"
          :language="language.language"
          :href="language.href"
        />
      </div>
    </section>

    <div class="home-support-grid">
      <section class="home-other-services-section">
        <div>
          <SectionEyebrow tone="dark">{{
            content.otherServices.eyebrow
          }}</SectionEyebrow>
          <h2>{{ content.otherServices.title }}</h2>
        </div>
        <div>
          <Scale :size="30" aria-hidden="true" />
          <p>{{ content.otherServices.body }}</p>
          <NuxtLink
            class="text-link dark-link"
            :to="content.otherServices.href"
          >
            {{ content.otherServices.linkLabel }}
            <ArrowUpRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>

      <section class="home-reviews-section">
        <Star :size="28" aria-hidden="true" />
        <SectionEyebrow>{{ content.reviews.eyebrow }}</SectionEyebrow>
        <h2>{{ content.reviews.title }}</h2>
        <p>{{ content.reviews.body }}</p>
        <strong class="coming-soon-status">{{ content.reviews.status }}</strong>
      </section>
    </div>

    <section class="faq-section">
      <div class="faq-intro">
        <SectionEyebrow>{{ content.faq.eyebrow }}</SectionEyebrow>
        <h2>{{ content.faq.title }}</h2>
        <p>{{ content.faq.body }}</p>
        <a class="text-link" href="#contact">
          {{ content.faq.linkLabel }}
          <ArrowUpRight :size="16" aria-hidden="true" />
        </a>
      </div>
      <FaqAccordion :items="content.faq.items" id-prefix="home-faq" />
    </section>

    <section id="contact" class="contact-section">
      <div class="contact-inner">
        <div>
          <SectionEyebrow>{{ content.contact.eyebrow }}</SectionEyebrow>
          <h2>{{ content.contact.title }}</h2>
          <p class="contact-lede">{{ content.contact.body }}</p>
        </div>
        <div class="contact-card">
          <p class="contact-card-label">{{ content.contact.cardLabel }}</p>
          <ContactActions />
          <div class="contact-rule" />
          <p>
            {{ content.contact.preferencePrompt }}
            <NuxtLink to="/contact">
              {{ content.contact.optionsLabel }}
              <ArrowUpRight :size="16" aria-hidden="true" />
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
