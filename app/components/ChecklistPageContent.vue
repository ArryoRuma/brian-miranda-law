<script setup lang="ts">
import { Check } from "@lucide/vue";
import { CHECKLIST_GROUPS } from "~/data/resources";

usePageSeo({
  title: "Estate Planning Checklist",
  description:
    "Prepare for an estate-planning consultation with a practical checklist covering family, documents, property, decision-makers, and questions.",
  path: "/resources/estate-planning-checklist",
});
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero
      eyebrow="Estate planning checklist"
      title="Gather what you can."
      accent="Bring the questions you still have."
      lead="You do not need every account number or every decision before a consultation. This checklist helps you collect the information that can make the conversation more productive."
      secondary-href="/resources/estate-planning-faqs"
      secondary-label="Read the FAQs"
    />
    <section class="checklist-section">
      <div class="checklist-intro">
        <SectionEyebrow tone="dark">Preparation guide</SectionEyebrow>
        <h2>Use this as a working list—not a test.</h2>
        <p>
          Check what is easy to gather. Make a note beside anything you cannot
          find or do not understand. Those gaps are useful topics for the
          consultation.
        </p>
      </div>
      <div class="checklist-groups">
        <section
          v-for="(group, index) in CHECKLIST_GROUPS"
          :key="group.title"
          class="checklist-group"
        >
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">
              <Check :size="17" aria-hidden="true" /> {{ item }}
            </li>
          </ul>
        </section>
      </div>
    </section>
    <CallToAction
      title="You do not need to finish the checklist before calling."
      body="A free initial consultation can help you decide what information matters and what can wait until later."
    />
  </div>
</template>
