import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

const LABELS: Record<string, string> = {
  "/estate-planning": "Estate Planning",
  "/estate-planning/wills": "Wills",
  "/estate-planning/trusts": "Trusts",
  "/estate-planning/powers-of-attorney": "Powers of Attorney",
  "/estate-planning/health-care-directives": "Health Care Directives",
  "/about": "About Brian",
  "/resources": "Resources",
  "/resources/estate-planning-faqs": "Estate Planning FAQs",
  "/resources/estate-planning-checklist": "Estate Planning Checklist",
  "/resources/video-blog": "Video Library",
  "/other-services": "Other Legal Services",
  "/contact": "Contact",
  "/privacy": "Privacy",
  "/cookies": "Cookies",
  "/disclaimer": "Website Disclaimer",
  "/accessibility": "Accessibility",
  "/start/en": "English Questionnaire Preview",
  "/start/es": "Cuestionario en Español",
  "/start/pt": "Questionário em Português",
  "/start/en/what-happens-next": "What Happens Next",
  "/start/es/what-happens-next": "Próximos Pasos",
  "/start/pt/what-happens-next": "Próximos Passos",
  "/404": "Page Not Found",
};

function getBreadcrumbs(path: string) {
  if (path === "/") return [];

  const crumbs = [{ label: "Home", href: "/" }];
  const segments = path.split("/").filter(Boolean);
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    if (LABELS[currentPath]) {
      crumbs.push({ label: LABELS[currentPath], href: currentPath });
    }
  }

  return crumbs;
}

export function Breadcrumbs({ path }: { path: string }) {
  const breadcrumbs = getBreadcrumbs(path);
  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {breadcrumbs.map((crumb, index) => {
          const isCurrent = index === breadcrumbs.length - 1;
          return (
            <li key={crumb.href}>
              {index > 0 ? <ChevronRight size={14} aria-hidden="true" /> : null}
              {isCurrent ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link href={crumb.href}>{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
