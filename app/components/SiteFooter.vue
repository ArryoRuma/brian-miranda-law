<script setup lang="ts">
import { getPhoneHref } from "~/data/routes";
import { blogPosts } from "#site-content";

const siteCopy = useSiteCopy();
const { homePath, locale, localizePath } = useSiteLocale();
const site = computed(() => siteCopy.value.site);
const copy = computed(() => site.value.footer);
const contact = computed(() => site.value.contact);
const currentYear = new Date().getFullYear();
const resourceLinks = computed(() => [
  ...site.value.navigation.resources,
  ...(blogPosts.length
    ? [{ label: siteCopy.value.blog.label, href: siteCopy.value.blog.path }]
    : []),
]);
</script>

<template>
  <footer class="site-footer site-footer-expanded">
    <div class="footer-brand-column">
      <NuxtLink class="footer-logo-link" :to="homePath">
        <NuxtImg
          class="footer-logo"
          src="/miranda-law-gold.png"
          :alt="site.header.logoAlt"
          width="2434"
          height="2401"
          loading="lazy"
          densities="1x"
        />
      </NuxtLink>
      <p>{{ copy.description }}</p>
    </div>

    <div class="footer-link-column">
      <h2>{{ copy.estatePlanningHeading }}</h2>
      <NuxtLink
        v-for="item in site.navigation.estatePlanning"
        :key="item.href"
        :to="item.href"
      >
        {{ item.label }}
      </NuxtLink>
    </div>

    <div class="footer-link-column">
      <h2>{{ copy.resourcesHeading }}</h2>
      <NuxtLink v-for="item in resourceLinks" :key="item.href" :to="item.href">
        {{ item.label }}
      </NuxtLink>
      <NuxtLink :to="localizePath('/about')">{{ copy.aboutLabel }}</NuxtLink>
      <NuxtLink :to="localizePath('/other-services')">{{ copy.otherServicesLabel }}</NuxtLink>
    </div>

    <div class="footer-contact-column">
      <h2>{{ copy.contactHeading }}</h2>
      <a :href="getPhoneHref(contact.phoneHref)">{{ contact.phoneDisplay }}</a>
      <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      <a :href="contact.mapUrl" target="_blank" rel="noreferrer">
        {{ contact.addressLines[0] }}<br />
        {{ contact.addressLines[1] }}
      </a>
      <div class="footer-language-links">
        <NuxtLink
          v-for="item in site.navigation.languages"
          :key="item.href"
          :to="item.href"
          :aria-current="
            locale === item.label.toLowerCase() ? 'page' : undefined
          "
        >
          {{ item.language }}
        </NuxtLink>
      </div>
    </div>

    <div class="footer-legal-row">
      <span>© {{ currentYear }} {{ contact.name }}</span>
      <NuxtLink :to="localizePath('/privacy')">{{ copy.privacyLabel }}</NuxtLink>
      <NuxtLink :to="localizePath('/cookies')">{{ copy.cookiesLabel }}</NuxtLink>
      <NuxtLink :to="localizePath('/disclaimer')">{{ copy.disclaimerLabel }}</NuxtLink>
      <NuxtLink :to="localizePath('/accessibility')">{{ copy.accessibilityLabel }}</NuxtLink>
      <span>{{ copy.attorneyAdvertising }}</span>
    </div>
  </footer>
</template>
