import {
  FileText,
  HandCoins,
  HeartPulse,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export type PageSectionId =
  | "top"
  | "approach"
  | "services"
  | "process"
  | "contact";

export type Service = {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
  href: string;
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

export const SERVICES: readonly Service[] = [
  {
    icon: FileText,
    number: "01",
    title: "Wills",
    description:
      "Document your wishes, nominate an executor, and give the estate written direction.",
    href: "/estate-planning/wills",
  },
  {
    icon: Landmark,
    number: "02",
    title: "Trusts",
    description:
      "Create written terms for how selected property should be held, managed, and distributed.",
    href: "/estate-planning/trusts",
  },
  {
    icon: HandCoins,
    number: "03",
    title: "Powers of Attorney",
    description:
      "Choose a trusted agent to address defined financial and legal matters on your behalf.",
    href: "/estate-planning/powers-of-attorney",
  },
  {
    icon: HeartPulse,
    number: "04",
    title: "Health Care Directives",
    description:
      "Name a health care representative and communicate medical preferences for incapacity.",
    href: "/estate-planning/health-care-directives",
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

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "When should I begin estate planning?",
    answer:
      "There is no single right moment. Marriage, children, homeownership, retirement, health changes, and changing family responsibilities are common reasons to begin or review a plan.",
  },
  {
    question: "What should I bring to an initial conversation?",
    answer:
      "Bring any existing documents you can find and a general list of family members, property, accounts, insurance, business interests, and questions. You do not need final decisions or perfect numbers.",
  },
  {
    question: "How often should I review my plan?",
    answer:
      "A review can be useful after major family, health, property, or financial changes and when the people named in the documents are no longer the right choices.",
  },
  {
    question: "Do I need a plan if I am not wealthy?",
    answer:
      "Estate planning also addresses decision-makers, incapacity, children, personal property, and family guidance. Those issues matter at many asset levels.",
  },
  {
    question: "How much does estate planning cost?",
    answer:
      "Fees depend on the documents and complexity involved. Miranda Law explains the recommended scope and fee before legal work begins.",
  },
  {
    question: "Can Miranda Law assist me in Spanish or Portuguese?",
    answer:
      "Yes. The firm communicates with clients in English, Spanish, and Portuguese.",
  },
];
