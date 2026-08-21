<script setup lang="ts">
import { ArrowUpRight, Check } from "@lucide/vue";
import type { PageSectionContent } from "~/types/content";

const props = defineProps<{ section: PageSectionContent }>();
const siteCopy = await useSiteCopy();
const tone = computed(() => props.section.tone ?? "paper");
</script>

<template>
  <section
    :id="section.id"
    class="content-section"
    :class="`content-section-${tone}`"
  >
    <div class="content-section-heading">
      <SectionEyebrow
        v-if="section.eyebrow"
        :tone="tone === 'dark' || tone === 'blue' ? 'light' : 'dark'"
      >
        {{ section.eyebrow }}
      </SectionEyebrow>
      <h2>{{ section.title }}</h2>
    </div>

    <div class="content-section-body">
      <p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p>

      <ul v-if="section.bullets" class="check-list">
        <li v-for="item in section.bullets" :key="item">
          <Check :size="17" aria-hidden="true" />
          <span>{{ item }}</span>
        </li>
      </ul>

      <div v-if="section.cards" class="content-card-grid">
        <article
          v-for="(card, index) in section.cards"
          :key="card.title"
          class="content-card"
        >
          <span class="content-card-number">{{
            String(index + 1).padStart(2, "0")
          }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.body }}</p>
          <NuxtLink v-if="card.href" :to="card.href">
            {{ card.linkLabel ?? siteCopy.site.shared.learnMore }}
            <ArrowUpRight :size="15" aria-hidden="true" />
          </NuxtLink>
        </article>
      </div>

      <ol v-if="section.steps" class="editorial-steps">
        <li v-for="(step, index) in section.steps" :key="step.title">
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.body }}</p>
          </div>
        </li>
      </ol>

      <p v-if="section.note" class="content-note">{{ section.note }}</p>
    </div>
  </section>
</template>
