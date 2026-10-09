<script setup lang="ts">
definePageMeta({ i18n: { locales: ["en"] } });

const route = useRoute();
const siteCopy = useSiteCopy();
const content = computed(() => siteCopy.value.blog);
const post = useBlogPost(String(route.params.slug));

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Article not found" });
}

const article = computed(() => post.value!);
const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));

usePageSeo({
  title: article.value.title,
  description: article.value.description,
  path: `/blog/${article.value.slug}`,
  image: article.value.heroImage,
  type: "article",
  publishedAt: article.value.publishedAt,
  updatedAt: article.value.updatedAt,
});

useSchemaOrg([
  {
    "@type": "BlogPosting",
    "@id": `${siteCopy.value.site.url}/blog/${article.value.slug}#article`,
    headline: article.value.title,
    description: article.value.description,
    ...(article.value.heroImage
      ? { image: `${siteCopy.value.site.url}${article.value.heroImage}` }
      : {}),
    datePublished: article.value.publishedAt,
    dateModified: article.value.updatedAt ?? article.value.publishedAt,
    author: {
      "@id": `${siteCopy.value.site.url}/#brian-miranda`,
    },
    publisher: { "@id": `${siteCopy.value.site.url}/#legal-service` },
    isPartOf: { "@id": `${siteCopy.value.site.url}/blog#blog` },
    about: article.value.tags,
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@id": `${siteCopy.value.site.url}/blog/${article.value.slug}#webpage`,
    },
  },
]);
</script>

<template>
  <article class="blog-article">
    <Breadcrumbs :current-label="article.title" />
    <header class="blog-article-header">
      <SectionEyebrow>{{ content.articleLabel }}</SectionEyebrow>
      <h1>{{ article.title }}</h1>
      <p class="blog-article-lede">{{ article.description }}</p>
      <div class="blog-meta">
        <span>{{ article.author }}</span>
        <span>
          {{ content.publishedLabel }} {{ formatDate(article.publishedAt) }}
        </span>
        <span v-if="article.updatedAt">
          {{ content.updatedLabel }} {{ formatDate(article.updatedAt) }}
        </span>
      </div>
      <NuxtImg
        v-if="article.heroImage"
        :src="article.heroImage"
        :alt="article.heroImageAlt ?? ''"
        width="1600"
        height="900"
        sizes="xs:100vw lg:72vw"
        loading="eager"
        fetchpriority="high"
      />
    </header>
    <div class="blog-article-layout">
      <ContentRenderer class="blog-article-body" :value="article" />
      <aside v-if="article.tags.length">
        <h2>{{ content.topicsLabel }}</h2>
        <ul>
          <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
        </ul>
        <NuxtLink class="text-link dark-link" to="/blog">
          {{ content.backLabel }}
        </NuxtLink>
      </aside>
    </div>
  </article>
</template>
