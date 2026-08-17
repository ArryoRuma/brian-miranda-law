<script setup lang="ts">
import {
  CONTACT,
  ESTATE_PLANNING_NAVIGATION,
  LANGUAGE_LINKS,
  RESOURCE_NAVIGATION,
  getPhoneHref,
} from "~/data/site";
</script>

<template>
  <footer class="site-footer site-footer-expanded">
    <div class="footer-brand-column">
      <NuxtLink class="footer-logo-link" to="/">
        <NuxtImg
          class="footer-logo"
          src="/miranda-law-gold.png"
          alt="Miranda Law, Attorneys at Law"
          width="2434"
          height="2401"
          loading="lazy"
          densities="1x"
        />
      </NuxtLink>
      <p>
        Clear estate-planning guidance for North Jersey families, available in
        English, Spanish, and Portuguese.
      </p>
    </div>

    <div class="footer-link-column">
      <h2>Estate planning</h2>
      <NuxtLink
        v-for="item in ESTATE_PLANNING_NAVIGATION"
        :key="item.href"
        :to="item.href"
      >
        {{ item.label }}
      </NuxtLink>
    </div>

    <div class="footer-link-column">
      <h2>Resources</h2>
      <NuxtLink
        v-for="item in RESOURCE_NAVIGATION"
        :key="item.href"
        :to="item.href"
      >
        {{ item.label }}
      </NuxtLink>
      <NuxtLink to="/about">About Brian</NuxtLink>
      <NuxtLink to="/other-services">Other legal services</NuxtLink>
    </div>

    <div class="footer-contact-column">
      <h2>Start a conversation</h2>
      <a :href="getPhoneHref()">{{ CONTACT.phoneDisplay }}</a>
      <a :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a>
      <a :href="CONTACT.mapUrl" target="_blank" rel="noreferrer">
        {{ CONTACT.addressLines[0] }}<br />
        {{ CONTACT.addressLines[1] }}
      </a>
      <div class="footer-language-links">
        <NuxtLink
          v-for="item in LANGUAGE_LINKS"
          :key="item.href"
          :to="item.href"
        >
          {{ item.language }}
        </NuxtLink>
      </div>
    </div>

    <div class="footer-legal-row">
      <span>© 2026 {{ CONTACT.name }}</span>
      <NuxtLink to="/privacy">Privacy</NuxtLink>
      <NuxtLink to="/cookies">Cookies</NuxtLink>
      <NuxtLink to="/disclaimer">Website disclaimer</NuxtLink>
      <NuxtLink to="/accessibility">Accessibility</NuxtLink>
      <span
        >Attorney advertising. Prior results do not guarantee a similar
        outcome.</span
      >
    </div>
  </footer>
</template>
