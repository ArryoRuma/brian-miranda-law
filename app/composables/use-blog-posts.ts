import { blogPosts } from "#site-content";

export function useBlogPosts() {
  return computed(() => blogPosts);
}

export function useBlogPost(slug: string) {
  return computed(() => blogPosts.find(post => post.slug === slug));
}
