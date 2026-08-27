declare module "#site-content" {
  export const siteCopy: import("~~/lib/content/schema").SiteContent;
  export const blogPosts: readonly import("~~/lib/content/load-content").PublishedBlogPost[];
}
