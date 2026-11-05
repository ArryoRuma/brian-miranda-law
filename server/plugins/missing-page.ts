import {
  localizePublicPath,
  normalizeContentRoutePath,
} from "../../lib/content/localization";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export default defineNitroPlugin(nitro => {
  const config = useRuntimeConfig();
  const pages = new Set(config.pageRoutes.map(normalizeContentRoutePath));

  nitro.hooks.hook("render:before", context => {
    const { event } = context;
    if (context.response || !["GET", "HEAD"].includes(event.method)) return;

    const pathname = normalizeContentRoutePath(getRequestURL(event).pathname);
    const pagePath = normalizeContentRoutePath(
      pathname.replace(/\/_payload\.(?:json|js)$/, "")
    );
    if (pages.has(pagePath) || pathname === "/__nuxt_error") return;
    if (import.meta.prerender && ["/200.html", "/404.html"].includes(pathname))
      return;

    const prefix = pathname.split("/")[1];
    const locale = prefix === "es" || prefix === "pt" ? prefix : "en";
    const copy = config.missingPageCopy[locale];
    const home = localizePublicPath("/", locale);

    context.response = {
      statusCode: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
      },
      body:
        event.method === "HEAD"
          ? ""
          : `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${escapeHtml(copy.title)}</title></head>
<body><main><h1>${escapeHtml(copy.heading)}</h1>
<p>${escapeHtml(copy.body)}</p>
<a href="${home}">${escapeHtml(copy.actionLabel)}</a></main></body>
</html>`,
    };
  });
});
