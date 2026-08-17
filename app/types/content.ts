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
