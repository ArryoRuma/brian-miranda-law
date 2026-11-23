<script setup lang="ts">
import { getPhoneHref } from "~/data/routes";
import { locationHubPath } from "~~/lib/content/schema";

const siteCopy = useSiteCopy();
const blogPosts = useBlogPosts();
const { homePath, languageLinks, locale, localizePath } = useSiteLocale();
const site = computed(() => siteCopy.value.site);
const copy = computed(() => site.value.footer);
const contact = computed(() => site.value.contact);
const currentYear = new Date().getFullYear();
const resourceLinks = computed(() => [
  ...site.value.navigation.resources,
  ...(blogPosts.value.length
    ? [{ label: siteCopy.value.blog.label, href: siteCopy.value.blog.path }]
    : []),
]);
</script>

<template>
  <footer class="site-footer site-footer-expanded">
    <div class="footer-brand-column">
      <NuxtLink
        class="footer-logo-link"
        :to="homePath"
        :aria-label="site.header.homeAriaLabel"
      >
        <NuxtImg
          class="footer-logo"
          src="/miranda-law-gold.png"
          :alt="site.header.logoAlt"
          width="180"
          height="178"
          sizes="180px"
          loading="lazy"
          densities="1x 2x"
        />
      </NuxtLink>
      <p>{{ copy.description }}</p>
    </div>

    <div class="footer-link-column">
      <h2>{{ copy.estatePlanningHeading }}</h2>
      <NuxtLink
        v-for="item in site.navigation.estatePlanning"
        :key="item.href"
        :to="localizePath(item.href)"
      >
        {{ item.label }}
      </NuxtLink>
      <NuxtLink :to="localizePath(locationHubPath)">
        {{ siteCopy.locations.hub.eyebrow }}
      </NuxtLink>
    </div>

    <div class="footer-link-column">
      <h2>{{ copy.resourcesHeading }}</h2>
      <NuxtLink
        v-for="item in resourceLinks"
        :key="item.href"
        :to="localizePath(item.href)"
      >
        {{ item.label }}
      </NuxtLink>
      <NuxtLink :to="localizePath('/about')">{{ copy.aboutLabel }}</NuxtLink>
      <NuxtLink :to="localizePath('/other-services')">{{
        copy.otherServicesLabel
      }}</NuxtLink>
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
          v-for="item in languageLinks"
          :key="item.href"
          :to="item.href"
          :aria-current="locale === item.code ? 'page' : undefined"
        >
          {{ item.language }}
        </NuxtLink>
      </div>
    </div>

    <div class="footer-legal-row">
      <div class="footer-ownership">
        <span>© {{ currentYear }} {{ contact.name }}</span>
      </div>
      <nav
        class="footer-policy-links"
        :aria-label="site.breadcrumbs.labels['/disclaimer']"
      >
        <NuxtLink :to="localizePath('/privacy')">{{
          copy.privacyLabel
        }}</NuxtLink>
        <NuxtLink :to="localizePath('/cookies')">{{
          copy.cookiesLabel
        }}</NuxtLink>
        <NuxtLink :to="localizePath('/disclaimer')">{{
          copy.disclaimerLabel
        }}</NuxtLink>
        <NuxtLink :to="localizePath('/accessibility')">{{
          copy.accessibilityLabel
        }}</NuxtLink>
      </nav>
      <p class="footer-advertising">{{ copy.attorneyAdvertising }}</p>
      <a
        class="footer-design-credit"
        href="https://trumediacreative.com"
        target="_blank"
        rel="noreferrer"
        >{{ copy.designCredit }}</a
      >
    </div>
  </footer>
</template>

<style scoped>
.site-footer-expanded {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(
      0,
      1.2fr
    );
  column-gap: clamp(24px, 3vw, 48px);
  row-gap: 20px;
  padding-top: 56px;
}
.footer-brand-column,
.footer-link-column,
.footer-contact-column {
  min-width: 0;
}
.site-footer-expanded .footer-logo {
  width: 112px;
}
.site-footer-expanded h2 {
  font-size: 14px;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}
.footer-brand-column p {
  margin-top: 18px;
  font-size: 14px;
  line-height: 1.75;
}
.footer-link-column,
.footer-contact-column {
  gap: 0;
}
.footer-link-column a,
.footer-contact-column a {
  font-size: 14px;
  overflow-wrap: anywhere;
}
.footer-language-links {
  gap: 14px;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid rgba(250, 247, 240, 0.14);
}
.site-footer-expanded .footer-legal-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px;
  margin: 0;
  padding: 24px 0 30px;
  font-size: 13px;
  text-align: center;
  justify-items: center;
}
.footer-ownership {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 32px;
}
.footer-policy-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 24px;
}
.footer-legal-row a {
  font-size: 11px;
  min-height: 26px;
}
.footer-design-credit {
  display: inline-flex;
  align-items: center;
}
.footer-legal-row a:hover {
  color: var(--paper);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.footer-advertising {
  margin: 0;
  color: var(--text-on-dark-muted);
  font-size: 12px;
  line-height: 1.6;
}
@media (max-width: 1000px) {
  .site-footer-expanded {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .site-footer-expanded .footer-brand-column,
  .site-footer-expanded .footer-contact-column {
    grid-column: auto;
  }
  .site-footer-expanded .footer-link-column {
    display: grid;
  }
  .site-footer-expanded .footer-contact-column {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 560px) {
  .site-footer-expanded {
    row-gap: 28px;
    padding-top: 40px;
  }
  .site-footer-expanded .footer-brand-column,
  .site-footer-expanded .footer-contact-column {
    grid-column: 1 / -1;
  }
  .footer-ownership {
    flex-direction: column;
    gap: 4px;
  }
  .footer-policy-links {
    gap: 0 20px;
  }
}
</style>
