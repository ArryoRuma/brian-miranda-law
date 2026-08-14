import { ArrowUpRight, Search } from "lucide-react";
import { Link } from "wouter";
import { PageMeta } from "@/components/site/PageMeta";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function NotFound() {
  return (
    <div className="site-shell">
      <PageMeta
        title="Page Not Found"
        description="The requested Miranda Law page could not be found."
        path="/404"
        noIndex
      />
      <SiteHeader />
      <main className="not-found-page">
        <div>
          <span className="not-found-number">404</span>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> Page not found
          </p>
          <h1>This page is not part of the plan.</h1>
          <p>
            The address may be outdated or the page may have moved. Use the
            links below to return to the main site.
          </p>
          <div className="not-found-actions">
            <Link className="button button-brass" href="/">
              Return home <ArrowUpRight size={17} />
            </Link>
            <Link className="text-link" href="/resources">
              Browse resources <Search size={16} />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
