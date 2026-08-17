<script setup lang="ts">
import { Mail, MapPin, MessageCircle, Phone, Smartphone } from "@lucide/vue";
import { CONTACT_PAGE } from "~/data/page-content";
import { CONTACT, CONTACT_ACTIONS } from "~/data/site";

const icons = {
  call: Phone,
  text: Smartphone,
  whatsapp: MessageCircle,
  email: Mail,
};
const values = {
  call: CONTACT.phoneDisplay,
  text: "Send a text message",
  whatsapp: "Message on WhatsApp",
  email: CONTACT.email,
};

usePageSeo({
  title: CONTACT_PAGE.title,
  description: CONTACT_PAGE.metaDescription,
  path: CONTACT_PAGE.path,
});
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero v-bind="CONTACT_PAGE.hero" />
    <section class="contact-page-section">
      <div class="contact-page-intro">
        <SectionEyebrow tone="dark">Free initial consultation</SectionEyebrow>
        <h2>Choose the easiest way to reach the office.</h2>
        <p>
          The legal team handles initial intake and scheduling. A first
          conversation helps the firm understand the general nature of your
          matter and determine an appropriate next step.
        </p>
        <p class="content-note">
          Contacting the firm does not create an attorney-client relationship.
          Please do not send confidential or time-sensitive information until
          the firm confirms representation.
        </p>
      </div>
      <div class="contact-option-grid">
        <a
          v-for="action in CONTACT_ACTIONS"
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
          <strong>{{ values[action.id] }}</strong>
        </a>
      </div>
    </section>

    <section class="office-section">
      <div>
        <SectionEyebrow>Warren office</SectionEyebrow>
        <h2>Meet by appointment in North Jersey.</h2>
        <p>
          Miranda Law primarily serves clients in Monmouth County and
          communities north of it. Contact the office to arrange a consultation.
        </p>
      </div>
      <a
        class="office-address-card"
        :href="CONTACT.mapUrl"
        target="_blank"
        rel="noreferrer"
      >
        <MapPin :size="24" aria-hidden="true" />
        <span
          >{{ CONTACT.addressLines[0] }}<br />{{
            CONTACT.addressLines[1]
          }}</span
        >
      </a>
    </section>
  </div>
</template>
