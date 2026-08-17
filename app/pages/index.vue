<script setup lang="ts">
import {
  ArrowUpRight,
  Languages,
  Scale,
  ShieldCheck,
  Star,
  UserRound,
} from "@lucide/vue";
import { FAQ_ITEMS, PROCESS_STEPS, SERVICES } from "~/data/home";
import { CONTACT, SITE_URL } from "~/data/site";

usePageSeo({
  title: "Estate Planning in North Jersey",
  description:
    "Miranda Law provides clear guidance for wills, trusts, powers of attorney, and health care directives in English, Spanish, and Portuguese.",
  path: "/",
});

useSchemaOrg([
  {
    "@type": "LegalService",
    "@id": `${SITE_URL}/#legal-service`,
    name: CONTACT.name,
    alternateName: CONTACT.shortName,
    url: SITE_URL,
    image: `${SITE_URL}/images/brian-law-hero_7235d741.jpg.webp`,
    telephone: CONTACT.phoneHref,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "172 Washington Valley Road, Suite 3",
      addressLocality: "Warren",
      addressRegion: "NJ",
      postalCode: "07059",
      addressCountry: "US",
    },
    areaServed: "North Jersey",
    knowsLanguage: ["en", "es", "pt"],
  },
  {
    "@type": "Person",
    "@id": `${SITE_URL}/#brian-miranda`,
    name: CONTACT.attorney,
    jobTitle: "Attorney",
    worksFor: { "@id": `${SITE_URL}/#legal-service` },
  },
  {
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
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
        <SectionEyebrow>Estate planning, thoughtfully handled</SectionEyebrow>
        <h1>
          Plan with clarity.
          <br />
          <i>Leave with confidence.</i>
        </h1>
        <p class="hero-lede">
          A considered approach to the documents, decisions, and conversations
          that help protect what matters most.
        </p>
        <div class="hero-actions">
          <ContactActions />
          <a class="text-link" href="#process">
            How it works <ArrowUpRight :size="16" aria-hidden="true" />
          </a>
        </div>
        <p class="hero-note">
          <ShieldCheck :size="16" aria-hidden="true" />
          Clear guidance for the people and future you care about.
        </p>
      </div>
      <div class="hero-image-wrap">
        <NuxtImg
          src="/images/brian-law-hero_7235d741.jpg.webp"
          alt="A warmly lit estate-planning desk with an open folder, fountain pen, brass lamp, and law books"
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
          <span>Brian Miranda Law</span>
          <span>Private client practice</span>
        </div>
      </div>
      <div class="hero-index">01 <span>/</span> 04</div>
    </section>

    <section class="home-trust-strip" aria-label="Practice highlights">
      <span>Serving North Jersey families</span>
      <span>Free initial consultation</span>
      <span>English · Español · Português</span>
      <span>Call · Text · WhatsApp</span>
    </section>

    <section id="services" class="services-section">
      <div class="section-heading-row">
        <div>
          <SectionEyebrow tone="dark">Focused counsel</SectionEyebrow>
          <h2>What we help you put in place.</h2>
        </div>
        <p class="section-aside">
          A strong plan is both practical and personal. Our services are
          designed to give each the attention it deserves.
        </p>
      </div>
      <div class="services-list">
        <ServiceCard
          v-for="service in SERVICES"
          :key="service.number"
          :service="service"
        />
      </div>
    </section>

    <section id="process" class="process-section">
      <div class="process-image">
        <NuxtImg
          src="/images/brian-law-detail_25336cb9.jpg.webp"
          alt="A linen-bound planning book resting on layered papers and deep green folders"
          width="1536"
          height="1920"
          sizes="xs:100vw md:39vw"
          format="webp"
          loading="lazy"
        />
      </div>
      <div class="process-copy">
        <SectionEyebrow tone="dark">A clear way forward</SectionEyebrow>
        <h2>
          Start where you are.
          <br />
          <em>We will take it from there.</em>
        </h2>
        <div class="process-steps">
          <ProcessStep
            v-for="step in PROCESS_STEPS"
            :key="step.number"
            :step="step"
          />
        </div>
      </div>
    </section>

    <section class="home-about-section">
      <div class="home-about-mark" aria-hidden="true">
        <UserRound :size="35" />
        <span>BM</span>
      </div>
      <div>
        <SectionEyebrow tone="dark">Meet Brian Miranda</SectionEyebrow>
        <h2>A practical legal relationship starts with clear communication.</h2>
        <p>
          Brian M. Miranda, Esq. leads a North Jersey practice serving
          individuals and families who want direct explanations, responsive
          communication, and a plan grounded in their actual circumstances.
        </p>
        <NuxtLink class="text-link dark-link" to="/about">
          Meet Brian <ArrowUpRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <section class="home-language-section">
      <div>
        <Languages :size="32" aria-hidden="true" />
        <SectionEyebrow>Estate planning in your language</SectionEyebrow>
        <h2>Important decisions deserve language that feels clear.</h2>
        <p>
          Miranda Law communicates with clients in English, Spanish, and
          Portuguese—from the first inquiry through the planning process.
        </p>
      </div>
      <div class="language-card-grid">
        <LanguageLink code="EN" language="English" href="/start/en" />
        <LanguageLink code="ES" language="Español" href="/start/es" />
        <LanguageLink code="PT" language="Português" href="/start/pt" />
      </div>
    </section>

    <div class="home-support-grid">
      <section class="home-other-services-section">
        <div>
          <SectionEyebrow tone="dark">Other legal services</SectionEyebrow>
          <h2>Guidance for the matters around the plan.</h2>
        </div>
        <div>
          <Scale :size="30" aria-hidden="true" />
          <p>
            Miranda Law also assists with select real estate, corporate, civil
            litigation and defense, municipal, immigration, and landlord-tenant
            matters.
          </p>
          <NuxtLink class="text-link dark-link" to="/other-services">
            View other services <ArrowUpRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>

      <section class="home-reviews-section">
        <Star :size="28" aria-hidden="true" />
        <SectionEyebrow>Client reviews</SectionEyebrow>
        <h2>Verified client experiences are being prepared.</h2>
        <p>
          Approved feedback will be published after review. No testimonial
          language or ratings are presented before approval.
        </p>
        <strong class="coming-soon-status">Coming soon</strong>
      </section>
    </div>

    <section class="faq-section">
      <div class="faq-intro">
        <SectionEyebrow>A few first questions</SectionEyebrow>
        <h2>Clarity is a good place to begin.</h2>
        <p>
          Have a question that is not here? We are glad to start there, too.
        </p>
        <a class="text-link" href="#contact">
          Ask a question <ArrowUpRight :size="16" aria-hidden="true" />
        </a>
      </div>
      <FaqAccordion :items="FAQ_ITEMS" id-prefix="home-faq" />
    </section>

    <section id="contact" class="contact-section">
      <div class="contact-inner">
        <div>
          <SectionEyebrow>The next step can be simple</SectionEyebrow>
          <h2>Let’s make a thoughtful plan.</h2>
          <p class="contact-lede">
            Tell us a little about what brings you here. We will be in touch to
            arrange a private introductory conversation.
          </p>
        </div>
        <div class="contact-card">
          <p class="contact-card-label">Contact Brian directly</p>
          <ContactActions />
          <div class="contact-rule" />
          <p>
            Prefer WhatsApp or email?
            <NuxtLink to="/contact">
              View every contact option
              <ArrowUpRight :size="16" aria-hidden="true" />
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
