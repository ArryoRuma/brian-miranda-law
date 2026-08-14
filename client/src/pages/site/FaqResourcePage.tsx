import {
  FaqAccordionSection,
  FinalCta,
  InteriorHero,
} from "@/components/site/PageSections";
import { PageShell } from "@/components/site/PageShell";

const FAQ_GROUPS = [
  {
    title: "Getting started",
    items: [
      {
        question: "What documents are usually included in an estate plan?",
        answer:
          "Many plans include a will, financial power of attorney, and health care directives. A trust may be appropriate depending on the family, property, and goals involved.",
      },
      {
        question:
          "Do I need an estate plan if I do not have significant wealth?",
        answer:
          "Planning also addresses decision-makers, incapacity, minor children, personal property, and family guidance. Those issues can matter regardless of wealth.",
      },
      {
        question: "What should I bring to the first consultation?",
        answer:
          "Bring any existing estate-planning documents you can locate and a general list of family members, property, accounts, insurance, business interests, and questions. You do not need perfect numbers or final decisions.",
      },
      {
        question: "Is the initial consultation free?",
        answer:
          "Yes. Miranda Law provides an initial consultation at no charge and discusses the recommended scope and fee before legal work begins.",
      },
    ],
  },
  {
    title: "Wills and trusts",
    items: [
      {
        question: "What happens if I die without a will in New Jersey?",
        answer:
          "New Jersey's intestacy rules govern the distribution of probate property, and a court process may be needed to appoint an administrator. The result may not reflect every personal wish or relationship.",
      },
      {
        question: "Does a will avoid probate?",
        answer:
          "A will generally provides instructions for probate rather than avoiding the process by itself. Other ownership and trust arrangements may affect how particular assets are handled.",
      },
      {
        question: "Does everyone need a trust?",
        answer:
          "No. A trust can be useful for particular management, continuity, or distribution goals, but some plans can be handled effectively through other documents and arrangements.",
      },
      {
        question: "What does it mean to fund a trust?",
        answer:
          "Funding generally means transferring or coordinating selected assets so the trust can govern them. A signed trust that is not connected to the intended assets may not accomplish the expected result.",
      },
    ],
  },
  {
    title: "Planning for incapacity",
    items: [
      {
        question: "What does a financial power of attorney do?",
        answer:
          "It authorizes a person you choose to handle the financial, legal, property, or other matters described in the document.",
      },
      {
        question:
          "Is a health care directive the same as a financial power of attorney?",
        answer:
          "No. A health care directive concerns medical decision-making. A financial power of attorney concerns the financial and legal authority written into that document.",
      },
      {
        question:
          "Can my health care representative decide for me while I still can?",
        answer:
          "No. Under New Jersey guidance, the representative acts when you have been determined unable to make your own health care decisions. If you regain that ability, your own decisions control again.",
      },
      {
        question: "Who should receive copies of my health care directive?",
        answer:
          "Consider giving copies to your primary and alternate representatives, appropriate family members, physicians, and health care facilities involved in your care.",
      },
    ],
  },
  {
    title: "Working with Miranda Law",
    items: [
      {
        question: "Can Miranda Law assist me in Spanish or Portuguese?",
        answer:
          "Yes. The firm communicates with clients in English, Spanish, and Portuguese.",
      },
      {
        question: "How can I contact the office?",
        answer:
          "The legal team handles intake and scheduling by phone, text, WhatsApp, and email.",
      },
      {
        question: "How much does an estate plan cost?",
        answer:
          "The fee depends on the documents and complexity involved. The firm discusses the proposed work and fee after understanding your needs.",
      },
      {
        question: "How often should I update my plan?",
        answer:
          "Consider a review after major family, health, property, or financial changes and when the people named in the documents are no longer the right choices.",
      },
    ],
  },
] as const;

export default function FaqResourcePage() {
  return (
    <PageShell
      title="Estate Planning FAQs"
      description="Plain-language answers to common estate-planning questions about wills, trusts, incapacity documents, and working with Miranda Law."
      path="/resources/estate-planning-faqs"
    >
      <InteriorHero
        eyebrow="Estate planning FAQs"
        title="Clear answers create"
        accent="better questions."
        lead="Use these general answers to organize what you want to discuss. Your own plan should be based on your family, property, responsibilities, and goals."
        secondaryHref="/resources/estate-planning-checklist"
        secondaryLabel="Open the planning checklist"
      />
      {FAQ_GROUPS.map(group => (
        <FaqAccordionSection
          key={group.title}
          eyebrow={group.title}
          title={group.title}
          items={group.items}
        />
      ))}
      <FinalCta />
    </PageShell>
  );
}
