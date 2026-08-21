export type PageCard = {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

export type PageSectionContent = {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: readonly string[];
  bullets?: readonly string[];
  cards?: readonly PageCard[];
  steps?: readonly PageCard[];
  note?: string;
  tone?: "paper" | "sand" | "dark" | "blue";
};

export type FaqContent = {
  question: string;
  answer: string;
};

export type SitePageContent = {
  path: string;
  title: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    accent?: string;
    lead: string;
    image?: string;
    imageAlt?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
  sections: readonly PageSectionContent[];
  faqs?: readonly FaqContent[];
  finalCta?: {
    title: string;
    body: string;
  };
};

export type HomeService = {
  icon: "file" | "landmark" | "hand" | "heart";
  number: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
};
