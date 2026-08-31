<script setup lang="ts">
import {
  ArrowUpRight,
  Languages,
  MessageCircle,
  Scale,
  ShieldCheck,
  Star,
  UserRound,
} from "@lucide/vue";
import { getPhoneHref, getTextHref, getWhatsAppHref } from "~/data/routes";

definePageMeta({ alias: ["/es", "/pt"] });

const siteCopy = useSiteCopy();
const { locale, localizePath } = useSiteLocale();
const content = computed(() => siteCopy.value.home);
const site = computed(() => siteCopy.value.site);
const contact = computed(() => site.value.contact);
const structuredData = computed(() => site.value.structuredData);
const phoneHref = computed(() => getPhoneHref(contact.value.phoneHref));
const textHref = computed(() => getTextHref(contact.value.phoneHref));
const whatsAppHref = computed(() => getWhatsAppHref(contact.value.phoneHref));
const whyIcons = {
  shield: ShieldCheck,
  person: UserRound,
  message: MessageCircle,
  languages: Languages,
};

usePageSeo({
  title: content.value.seo.title,
  description: content.value.seo.description,
  path: content.value.seo.path,
});

useSchemaOrg([
  {
    "@type": "LegalService",
    "@id": site.value.url + "/#legal-service",
    name: contact.value.name,
    alternateName: contact.value.shortName,
    url: site.value.url,
    image: site.value.url + content.value.hero.image,
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
    "@id": site.value.url + "/#brian-miranda",
    name: contact.value.attorney,
    jobTitle: structuredData.value.attorneyJobTitle,
    worksFor: { "@id": site.value.url + "/#legal-service" },
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
  <div class="home-page">
    <section id="top" class="hero-section">
      <div class="hero-copy">
        <SectionEyebrow>{{ content.hero.eyebrow }}</SectionEyebrow>
        <h1>
          {{ content.hero.title }}
          <br />
          <i>{{ content.hero.accent }}</i>
        </h1>
        <p class="hero-lede">{{ content.hero.lead }}</p>
        <p class="hero-supporting-lede">{{ content.hero.supportingLead }}</p>
        <div class="hero-actions">
          <NuxtLink class="button button-primary" :to="localizePath('/contact')">
            {{ content.hero.ctaLabel }}
            <ArrowUpRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </div>
        <p class="hero-direct-contact">
          <span>{{ content.hero.contactPrompt }}</span>
          <a :href="phoneHref">{{ content.hero.callLabel }}</a>{{ `${content.hero.contactSeparator} ` }}
          <a :href="textHref">{{ content.hero.textLabel }}</a>{{ ` ${content.hero.contactFinalSeparator} ` }}
          <a :href="whatsAppHref" target="_blank" rel="noreferrer">
            {{ content.hero.whatsAppLabel }}</a
          >.
        </p>
        <p class="hero-note">
          <Languages :size="16" aria-hidden="true" />
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
      <div class="home-trust-strip-track">
        <div class="home-trust-strip-group">
          <span v-for="item in content.trustStrip" :key="item">{{ item }}</span>
        </div>
        <div class="home-trust-strip-group" aria-hidden="true">
          <span v-for="item in content.trustStrip" :key="'repeat-' + item">{{
            item
          }}</span>
        </div>
      </div>
    </section>

    <section id="estate-planning-intro" class="home-estate-intro">
      <div class="home-intro-heading">
        <SectionEyebrow tone="dark">
          {{ content.intro.eyebrow }}
        </SectionEyebrow>
        <h2>{{ content.intro.title }}</h2>
      </div>
      <div class="home-intro-body">
        <p v-for="paragraph in content.intro.paragraphs" :key="paragraph">
          {{ paragraph }}
        </p>
        <NuxtLink class="button button-primary" :to="content.intro.href">
          {{ content.intro.ctaLabel }}
          <ArrowUpRight :size="17" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <section id="services" class="services-section">
      <div class="section-heading-row">
        <div>
          <SectionEyebrow tone="dark">
            {{ content.services.eyebrow }}
          </SectionEyebrow>
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

    <section class="home-why-section">
      <div class="home-why-heading">
        <SectionEyebrow>{{ content.why.eyebrow }}</SectionEyebrow>
        <h2>{{ content.why.title }}</h2>
        <p>{{ content.why.body }}</p>
      </div>
      <div class="home-why-grid">
        <article
          v-for="item in content.why.items"
          :key="item.title"
          class="home-why-card"
        >
          <component
            :is="whyIcons[item.icon]"
            :size="34"
            :stroke-width="1.5"
            aria-hidden="true"
          />
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
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
        <SectionEyebrow tone="dark">
          {{ content.process.eyebrow }}
        </SectionEyebrow>
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
        <NuxtLink
          class="button button-primary process-cta"
          :to="content.process.href"
        >
          {{ content.process.ctaLabel }}
          <ArrowUpRight :size="17" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <section class="home-about-section">
      <div class="home-about-mark" aria-hidden="true">
        <UserRound :size="48" />
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

    <div class="home-support-grid home-assistance-grid">
      <section class="home-language-section">
        <div>
          <Languages :size="36" aria-hidden="true" />
          <SectionEyebrow>{{ content.languages.eyebrow }}</SectionEyebrow>
          <h2>{{ content.languages.title }}</h2>
          <p>{{ content.languages.body }}</p>
          <p class="language-availability">
            {{ content.languages.availability }}
          </p>
          <p>{{ content.languages.prompt }}</p>
        </div>
        <div class="language-card-grid">
          <LanguageLink
            v-for="language in content.languages.items"
            :key="language.href"
            :code="language.label"
            :language="language.language"
            :href="language.href"
            :active="locale === language.label.toLowerCase()"
          />
        </div>
        <NuxtLink
          class="text-link"
          :to="content.languages.questionnaireHref"
        >
          {{ content.languages.questionnaireLabel }}
          <ArrowUpRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </section>

      <section class="home-other-services-section">
        <div>
          <SectionEyebrow tone="dark">
            {{ content.otherServices.eyebrow }}
          </SectionEyebrow>
          <h2>{{ content.otherServices.title }}</h2>
        </div>
        <div>
          <Scale :size="30" aria-hidden="true" />
          <p>{{ content.otherServices.body }}</p>
          <ul class="other-services-list">
            <li v-for="item in content.otherServices.items" :key="item">
              {{ item }}
            </li>
          </ul>
          <NuxtLink
            class="text-link dark-link"
            :to="content.otherServices.href"
          >
            {{ content.otherServices.linkLabel }}
            <ArrowUpRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>
    </div>

    <section class="home-reviews-section home-testimonials-section">
      <div>
        <Star :size="36" aria-hidden="true" />
        <SectionEyebrow>{{ content.reviews.eyebrow }}</SectionEyebrow>
        <h2>{{ content.reviews.title }}</h2>
      </div>
      <div class="reviews-placeholder-card">
        <p>{{ content.reviews.body }}</p>
        <strong class="coming-soon-status">{{ content.reviews.status }}</strong>
      </div>
    </section>

    <section class="faq-section home-faq-section">
      <div class="faq-intro">
        <SectionEyebrow tone="dark">{{ content.faq.eyebrow }}</SectionEyebrow>
        <h2>{{ content.faq.title }}</h2>
        <p>{{ content.faq.body }}</p>
        <NuxtLink class="text-link dark-link" :to="content.faq.href">
          {{ content.faq.linkLabel }}
          <ArrowUpRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </div>
      <FaqAccordion :items="content.faq.items" id-prefix="home-faq" />
    </section>

    <section id="contact" class="contact-section home-contact-section">
      <div class="contact-inner">
        <div>
          <SectionEyebrow>{{ content.contact.eyebrow }}</SectionEyebrow>
          <h2>{{ content.contact.title }}</h2>
          <p class="contact-lede">{{ content.contact.body }}</p>
        </div>
        <div class="contact-card">
          <p class="contact-card-label">{{ content.contact.cardLabel }}</p>
          <NuxtLink
            class="button button-primary contact-consultation-cta"
            :to="localizePath('/contact')"
          >
            {{ content.contact.ctaLabel }}
            <ArrowUpRight :size="17" aria-hidden="true" />
          </NuxtLink>
          <div class="contact-rule" />
          <ContactActions />
          <a
            class="contact-whatsapp-link"
            :href="whatsAppHref"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
            <ArrowUpRight :size="16" aria-hidden="true" />
          </a>
          <p class="contact-language-note">
            {{ content.contact.preferencePrompt }}
            <strong>{{ content.contact.optionsLabel }}</strong>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
