export function useBlogPosts() {
  const { $repositoryContent } = useNuxtApp();
  return computed(() => $repositoryContent.blogPosts);
}

export function useBlogPost(slug: string) {
  const posts = useBlogPosts();
  return computed(() => posts.value.find(post => post.slug === slug));
}
