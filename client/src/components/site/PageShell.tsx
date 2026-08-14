import type { ReactNode } from "react";
import { PageMeta } from "./PageMeta";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type PageShellProps = {
  children: ReactNode;
  title: string;
  description: string;
  path: string;
  language?: "en" | "es" | "pt";
  noIndex?: boolean;
};

export function PageShell({
  children,
  title,
  description,
  path,
  language,
  noIndex,
}: PageShellProps) {
  return (
    <div className="site-shell">
      <PageMeta
        title={title}
        description={description}
        path={path}
        language={language}
        noIndex={noIndex}
      />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
