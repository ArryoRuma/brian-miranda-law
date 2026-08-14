import { Check } from "lucide-react";
import { FinalCta, InteriorHero } from "@/components/site/PageSections";
import { PageShell } from "@/components/site/PageShell";

const CHECKLIST_GROUPS = [
  {
    title: "People and family",
    items: [
      "Legal names and contact information for close family members",
      "Children, stepchildren, and anyone who depends on you",
      "People you may trust as executor, trustee, agent, or health care representative",
      "Backup choices if a first choice cannot serve",
    ],
  },
  {
    title: "Existing documents",
    items: [
      "Current wills, trusts, powers of attorney, and health care directives",
      "Prenuptial, postnuptial, divorce, or separation agreements that may affect planning",
      "Business agreements or succession documents",
      "Any document you no longer understand or believe is out of date",
    ],
  },
  {
    title: "Property and accounts",
    items: [
      "Homes, other real estate, and how each property is titled",
      "Bank, investment, and retirement accounts",
      "Life insurance and current beneficiary designations",
      "Business ownership, vehicles, and significant personal property",
      "Debts, mortgages, and other major obligations",
    ],
  },
  {
    title: "Your wishes",
    items: [
      "Who should receive property and whether any gifts need special handling",
      "Who should administer the estate",
      "Who should care for minor children if a guardian is needed",
      "Whether property should be managed over time for a beneficiary",
      "Charitable gifts or personal items with special meaning",
    ],
  },
  {
    title: "Financial decision-making",
    items: [
      "Who should handle financial and legal matters if you cannot",
      "What authority that person may need",
      "Who should serve as the backup agent",
      "Any business, property, benefits, or family responsibilities the agent should understand",
    ],
  },
  {
    title: "Health care decisions",
    items: [
      "Who should serve as health care representative and alternate",
      "Treatment preferences or values you want that person to understand",
      "Physicians and family members who should receive a copy",
      "Existing forms that may need review or replacement",
    ],
  },
  {
    title: "Questions for the consultation",
    items: [
      "What prompted you to consider planning now?",
      "What are you most concerned could become confusing or difficult?",
      "Are there family relationships or special needs the documents should account for?",
      "Which decisions are you ready to make, and which ones still feel uncertain?",
      "How soon do you need assistance?",
    ],
  },
] as const;

export default function ChecklistPage() {
  return (
    <PageShell
      title="Estate Planning Checklist"
      description="Prepare for an estate-planning consultation with a practical checklist covering family, documents, property, decision-makers, and questions."
      path="/resources/estate-planning-checklist"
    >
      <InteriorHero
        eyebrow="Estate planning checklist"
        title="Gather what you can."
        accent="Bring the questions you still have."
        lead="You do not need every account number or every decision before a consultation. This checklist helps you collect the information that can make the conversation more productive."
        secondaryHref="/resources/estate-planning-faqs"
        secondaryLabel="Read the FAQs"
      />
      <section className="checklist-section">
        <div className="checklist-intro">
          <p className="eyebrow dark">
            <span className="eyebrow-rule" /> Preparation guide
          </p>
          <h2>Use this as a working list—not a test.</h2>
          <p>
            Check what is easy to gather. Make a note beside anything you cannot
            find or do not understand. Those gaps are useful topics for the
            consultation.
          </p>
        </div>
        <div className="checklist-groups">
          {CHECKLIST_GROUPS.map((group, index) => (
            <section className="checklist-group" key={group.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map(item => (
                  <li key={item}>
                    <Check size={17} aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <FinalCta
        title="You do not need to finish the checklist before calling."
        body="A free initial consultation can help you decide what information matters and what can wait until later."
      />
    </PageShell>
  );
}
