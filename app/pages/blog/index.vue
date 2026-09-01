<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";

definePageMeta({ i18n: { locales: ["en"] } });

const siteCopy = useSiteCopy();
const content = computed(() => siteCopy.value.blog);
const posts = useBlogPosts();

if (!posts.value.length) {
  throw createError({ statusCode: 404, statusMessage: "Blog not published" });
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));

usePageSeo({
  title: content.value.seo.title,
  description: content.value.seo.description,
  path: content.value.path,
});

useSchemaOrg([
  {
    "@type": "Blog",
    name: content.value.seo.title,
    description: content.value.seo.description,
    url: `${siteCopy.value.site.url}${content.value.path}`,
    blogPost: posts.value.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${siteCopy.value.site.url}/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  },
]);
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero v-bind="content.hero" />
    <section class="blog-index-section">
      <article v-for="post in posts" :key="post.slug" class="blog-card">
        <NuxtImg
          :src="post.heroImage"
          :alt="post.heroImageAlt"
          width="1200"
          height="800"
          sizes="xs:100vw md:40vw"
          loading="lazy"
        />
        <div>
          <p class="blog-meta">
            {{ content.publishedLabel }} {{ formatDate(post.publishedAt) }}
          </p>
          <h2>{{ post.title }}</h2>
          <p>{{ post.description }}</p>
          <NuxtLink class="text-link dark-link" :to="`/blog/${post.slug}`">
            {{ content.articleLabel }}
            <ArrowUpRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </div>
      </article>
    </section>
  </div>
</template>
