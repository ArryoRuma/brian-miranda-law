<script setup lang="ts">
import { Play } from "@lucide/vue";
import { VIDEO_TOPICS } from "~/data/resources";

usePageSeo({
  title: "Estate Planning Video Library",
  description:
    "Explore Miranda Law's planned video topics covering wills, trusts, powers of attorney, health care directives, and consultation preparation.",
  path: "/resources/video-blog",
});
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero
      eyebrow="Video library"
      title="Estate planning explained"
      accent="with clarity."
      lead="Short videos are being prepared to answer common questions in a direct, useful format."
      secondary-href="/resources/estate-planning-faqs"
      secondary-label="Read the FAQs now"
    />
    <section class="video-library-section">
      <div class="video-library-heading coming-soon-panel">
        <SectionEyebrow tone="dark">Coming soon</SectionEyebrow>
        <h2>Reviewed videos are in production.</h2>
        <p>
          Topics are listed as a preview. No recording, client story, or legal
          outcome is represented before final review and publication.
        </p>
      </div>
      <div class="video-topic-grid">
        <article v-for="topic in VIDEO_TOPICS" :key="topic.title">
          <div class="video-placeholder" aria-hidden="true">
            <Play :size="28" />
            <span>Video coming soon</span>
          </div>
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.summary }}</p>
        </article>
      </div>
    </section>
    <CallToAction />
  </div>
</template>
