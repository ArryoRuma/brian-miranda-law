import { Compass, FileText, Users, type LucideIcon } from "lucide-react";

export type PageSectionId =
  | "top"
  | "approach"
  | "services"
  | "process"
  | "contact";

export type NavigationItem = {
  label: string;
  sectionId: Exclude<PageSectionId, "top">;
};

export type Service = {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { label: "Approach", sectionId: "approach" },
  { label: "Services", sectionId: "services" },
  { label: "Process", sectionId: "process" },
  { label: "Contact", sectionId: "contact" },
];

export const SERVICES: readonly Service[] = [
  {
    icon: FileText,
    number: "01",
    title: "Wills & trusts",
    description:
      "Thoughtful documents that express your wishes and help your loved ones move forward with clarity.",
  },
  {
    icon: Users,
    number: "02",
    title: "Family & legacy planning",
    description:
      "A plan that accounts for the people, relationships, and responsibilities that make your family unique.",
  },
  {
    icon: Compass,
    number: "03",
    title: "Guidance through change",
    description:
      "Review and refinement when life shifts, so your plan continues to reflect what matters now.",
  },
];

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Listen",
    description:
      "We begin with your priorities, questions, and the people you want to protect.",
  },
  {
    number: "02",
    title: "Shape",
    description:
      "We translate those priorities into a plan that is clear, cohesive, and built for real life.",
  },
  {
    number: "03",
    title: "Carry forward",
    description:
      "You leave with documents you understand and a plan you can return to as life changes.",
  },
];

const DEFAULT_FAQ_ANSWER =
  "There is no single right moment. A first conversation is simply a way to understand what you have in place, what has changed, and what you may want to consider next.";

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "When should I begin estate planning?",
    answer: DEFAULT_FAQ_ANSWER,
  },
  {
    question: "What should I bring to an initial conversation?",
    answer: DEFAULT_FAQ_ANSWER,
  },
  {
    question: "How often should I review my plan?",
    answer: DEFAULT_FAQ_ANSWER,
  },
  {
    question: "Can you help my family understand the documents?",
    answer: DEFAULT_FAQ_ANSWER,
  },
];
