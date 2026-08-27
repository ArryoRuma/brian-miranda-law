<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";
import type { PageSectionContent } from "~/types/content";

type CardsSection = Extract<PageSectionContent, { type: "cards" }>;

defineProps<{ section: CardsSection }>();

const siteCopy = useSiteCopy();
</script>

<template>
  <PageSectionFrame
    :id="section.id"
    :eyebrow="section.eyebrow"
    :title="section.title"
    :tone="section.tone"
    :type="section.type"
  >
    <div class="content-card-grid editorial-card-grid">
      <article
        v-for="(card, index) in section.cards"
        :key="card.title + '-' + index"
        class="content-card editorial-card"
        :class="{ 'is-linked': card.href }"
      >
        <span class="content-card-number">
          {{ String(index + 1).padStart(2, "0") }}
        </span>
        <h3>{{ card.title }}</h3>
        <p>{{ card.body }}</p>
        <NuxtLink v-if="card.href" :to="card.href" class="content-card-link">
          {{ card.linkLabel ?? siteCopy.site.shared.learnMore }}
          <ArrowUpRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </article>
    </div>
    <p v-if="section.note" class="content-note">{{ section.note }}</p>
  </PageSectionFrame>
</template>
