<script setup lang="ts">
import { ChevronDown, Menu, X } from "@lucide/vue";
import { blogPosts } from "#site-content";

const route = useRoute();
const { homePath, languageLinks, locale, localizePath } = useSiteLocale();
const siteCopy = useSiteCopy();
const navigation = computed(() => [
  ...siteCopy.value.site.navigation.primary,
  ...(blogPosts.length
    ? [
        {
          id: "blog",
          label: siteCopy.value.blog.label,
          href: siteCopy.value.blog.path,
        },
      ]
    : []),
]);
const copy = computed(() => siteCopy.value.site.header);
const menuOpen = ref(false);
const estateMenuOpen = ref(false);
const menuButton = ref<HTMLButtonElement>();
const header = ref<HTMLElement>();

const estateItem = computed(() => {
  const item = navigation.value.find(item => item.id === "estate-planning");
  if (!item) throw createError("Estate-planning navigation is missing");
  return item;
});
const secondaryNavigation = computed(() =>
  navigation.value.filter(item => item.id !== "estate-planning")
);

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
  <a class="skip-link" href="#main-content">{{ copy.skipLink }}</a>
  <div class="desktop-rail" aria-hidden="true">
    <span class="rail-mark">{{ copy.railMark }}</span>
    <span class="rail-line" />
    <span class="rail-label">{{ copy.railLabel }}</span>
  </div>
  <header ref="header" class="site-header" @keydown="trapMenuFocus">
    <NuxtLink
      class="brand-lockup"
      :to="homePath"
      :aria-label="copy.homeAriaLabel"
    >
      <NuxtImg
        class="brand-logo"
        src="/miranda-law-gold.png"
        :alt="copy.logoAlt"
        width="2434"
        height="2401"
        densities="1x"
      />
    </NuxtLink>

    <button
      ref="menuButton"
      class="menu-button"
      type="button"
      :aria-label="menuOpen ? copy.closeMenuAriaLabel : copy.openMenuAriaLabel"
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
      :aria-label="copy.navigationAriaLabel"
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
            :class="{
              'is-active': route.path.startsWith(localizePath(estateItem.href)),
            }"
            :to="localizePath(estateItem.href)"
            :aria-current="
              route.path === localizePath(estateItem.href) ? 'page' : undefined
            "
          >
            {{ estateItem.label }}
          </NuxtLink>
          <button
            class="nav-submenu-toggle"
            type="button"
            :aria-label="copy.estateMenuAriaLabel"
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
            :to="localizePath(item.href)"
            :aria-current="
              route.path === localizePath(item.href) ? 'page' : undefined
            "
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>

      <NuxtLink
        v-for="item in secondaryNavigation"
        :key="item.href"
        :class="{ 'is-active': route.path === localizePath(item.href) }"
        :to="localizePath(item.href)"
        :aria-current="
          route.path === localizePath(item.href) ? 'page' : undefined
        "
      >
        {{ item.label }}
      </NuxtLink>

      <div class="nav-languages" :aria-label="copy.questionnairesAriaLabel">
        <NuxtLink
          v-for="item in languageLinks"
          :key="item.href"
          :to="item.href"
          :aria-label="
            copy.questionnaireLinkAriaLabel.replace('{language}', item.language)
          "
          :aria-current="locale === item.code ? 'page' : undefined"
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
      :aria-label="copy.backdropAriaLabel"
      tabindex="-1"
      @click="closeMobileMenu(true)"
    />
  </header>
  <aside class="mobile-contact-bar" :aria-label="copy.quickContactAriaLabel">
    <ContactActions compact />
  </aside>
</template>
