import { useState } from "react";
import { ArrowUpRight, ChevronDown, Minus } from "lucide-react";
import { FAQ_ITEMS, type FaqItem } from "../content";
import { scrollToSection } from "../navigation";
import { SectionEyebrow } from "../SectionEyebrow";

type FaqAccordionItemProps = {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
};

function FaqAccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  const answerId = `faq-answer-${index}`;

  return (
    <div className={isOpen ? "faq-item is-open" : "faq-item"}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => onToggle(index)}
      >
        <span>{faq.question}</span>
        {isOpen ? (
          <Minus size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>
      {isOpen ? <p id={answerId}>{faq.answer}</p> : null}
    </div>
  );
}

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(current => (current === index ? null : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-intro">
        <SectionEyebrow>A few first questions</SectionEyebrow>
        <h2>Clarity is a good place to begin.</h2>
        <p>
          Have a question that is not here? We are glad to start there, too.
        </p>
        <button
          className="text-link"
          type="button"
          onClick={() => scrollToSection("contact")}
        >
          Ask a question <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="faq-list">
        {FAQ_ITEMS.slice(0, 3).map((faq, index) => (
          <FaqAccordionItem
            key={faq.question}
            faq={faq}
            index={index}
            isOpen={openFaq === index}
            onToggle={toggleFaq}
          />
        ))}
      </div>
    </section>
  );
}
