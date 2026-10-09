<script setup lang="ts">
const dismissed = ref(false);
const siteCopy = useSiteCopy();
const { localizePath } = useSiteLocale();
const content = computed(() => {
  const value = siteCopy.value.legal.cookies;
  if (!value) throw new Error("Cookie notice content is missing");
  return value;
});

onMounted(() => {
  dismissed.value =
    window.localStorage.getItem("miranda-cookie-notice") === "dismissed";
});

function dismiss() {
  dismissed.value = true;
  window.localStorage.setItem("miranda-cookie-notice", "dismissed");
}
</script>

<template>
  <aside v-if="!dismissed" class="cookie-notice" aria-label="Cookie notice">
    <div>
      <strong>{{ content.title }}</strong>
      <p>{{ content.intro }}</p>
      <NuxtLink :to="localizePath('/cookies')">{{ content.title }}</NuxtLink>
    </div>
    <button type="button" @click="dismiss">Dismiss</button>
  </aside>
</template>
