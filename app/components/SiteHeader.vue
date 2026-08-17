<script setup lang="ts">
import { ChevronDown, Menu, X } from "@lucide/vue";
import { LANGUAGE_LINKS, SITE_NAVIGATION } from "~/data/site";

const route = useRoute();
const menuOpen = ref(false);
const estateMenuOpen = ref(false);
const menuButton = ref<HTMLButtonElement>();
const header = ref<HTMLElement>();

const estateItem = SITE_NAVIGATION[0];

function closeMobileMenu(restoreFocus = false) {
  menuOpen.value = false;
  estateMenuOpen.value = false;

  if (restoreFocus) {
    requestAnimationFrame(() => menuButton.value?.focus());
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key !== "Escape") return;

  if (menuOpen.value) {
    closeMobileMenu(true);
  } else if (estateMenuOpen.value) {
    estateMenuOpen.value = false;
  }
}

function trapMenuFocus(event: KeyboardEvent) {
  if (!menuOpen.value || event.key !== "Tab" || !header.value) return;

  const focusable = Array.from(
    header.value.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    )
  ).filter(element => element.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable.at(-1);

  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => route.fullPath,
  () => closeMobileMenu()
);

watch(menuOpen, isOpen => {
  if (!import.meta.client) return;
  document.body.style.overflow = isOpen ? "hidden" : "";
});

onMounted(() => document.addEventListener("keydown", handleEscape));
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
});
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <div class="desktop-rail" aria-hidden="true">
    <span class="rail-mark">BM</span>
    <span class="rail-line" />
    <span class="rail-label">Brian Miranda Law</span>
  </div>
  <header ref="header" class="site-header" @keydown="trapMenuFocus">
    <NuxtLink class="brand-lockup" to="/" aria-label="Miranda Law home">
      <NuxtImg
        class="brand-logo"
        src="/miranda-law-gold.png"
        alt="Miranda Law, Attorneys at Law"
        width="2434"
        height="2401"
        densities="1x"
      />
    </NuxtLink>

    <button
      ref="menuButton"
      class="menu-button"
      type="button"
      :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
      aria-controls="main-navigation"
      :aria-expanded="menuOpen"
      @click="menuOpen ? closeMobileMenu(true) : (menuOpen = true)"
    >
      <X v-if="menuOpen" :size="24" aria-hidden="true" />
      <Menu v-else :size="24" aria-hidden="true" />
    </button>

    <nav
      id="main-navigation"
      class="main-nav"
      :class="{ 'is-open': menuOpen }"
      aria-label="Main navigation"
    >
      <div
        class="nav-item-with-menu"
        @mouseenter="estateMenuOpen = true"
        @mouseleave="estateMenuOpen = false"
        @focusin="estateMenuOpen = true"
        @focusout="
          event => {
            const target = event.currentTarget as HTMLElement;
            if (!target.contains(event.relatedTarget as Node | null))
              estateMenuOpen = false;
          }
        "
      >
        <div class="nav-parent-row">
          <NuxtLink
            :class="{ 'is-active': route.path.startsWith(estateItem.href) }"
            :to="estateItem.href"
            :aria-current="route.path === estateItem.href ? 'page' : undefined"
          >
            {{ estateItem.label }}
          </NuxtLink>
          <button
            class="nav-submenu-toggle"
            type="button"
            aria-label="Toggle Estate Planning pages"
            :aria-expanded="estateMenuOpen"
            aria-controls="estate-planning-submenu"
            @click="estateMenuOpen = !estateMenuOpen"
          >
            <ChevronDown :size="16" aria-hidden="true" />
          </button>
        </div>
        <div
          id="estate-planning-submenu"
          class="nav-submenu"
          :class="{ 'is-open': estateMenuOpen }"
        >
          <NuxtLink
            v-for="item in estateItem.children"
            :key="item.href"
            :to="item.href"
            :aria-current="route.path === item.href ? 'page' : undefined"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>

      <NuxtLink
        v-for="item in SITE_NAVIGATION.slice(1)"
        :key="item.href"
        :class="{ 'is-active': route.path === item.href }"
        :to="item.href"
        :aria-current="route.path === item.href ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>

      <div class="nav-languages" aria-label="Questionnaire previews">
        <NuxtLink
          v-for="item in LANGUAGE_LINKS"
          :key="item.href"
          :to="item.href"
          :aria-label="`Open the ${item.language} questionnaire preview`"
          :aria-current="route.path === item.href ? 'page' : undefined"
        >
          <span class="language-short" aria-hidden="true">{{
            item.label
          }}</span>
          <span class="language-full">{{ item.language }}</span>
        </NuxtLink>
      </div>

      <ContactActions class="nav-contact-actions" compact />
    </nav>

    <button
      v-if="menuOpen"
      class="nav-backdrop"
      type="button"
      aria-label="Close navigation menu"
      tabindex="-1"
      @click="closeMobileMenu(true)"
    />
  </header>
  <aside class="mobile-contact-bar" aria-label="Quick contact options">
    <ContactActions compact />
  </aside>
</template>
