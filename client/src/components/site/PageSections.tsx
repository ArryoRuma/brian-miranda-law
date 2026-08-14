import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  MessageCircle,
  Minus,
  Phone,
  Smartphone,
} from "lucide-react";
import { Link } from "wouter";
import {
  CONTACT,
  CONSULTATION_HREF,
  getPhoneHref,
  getTextHref,
  getWhatsAppHref,
} from "@/site/siteConfig";

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

type InteriorHeroProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  lead: string;
  image?: string;
  imageAlt?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function InteriorHero({
  eyebrow,
  title,
  accent,
  lead,
  image = "/images/brian-law-hero_7235d741.jpg.webp",
  imageAlt = "Estate-planning documents arranged on a warm desk",
  secondaryHref,
  secondaryLabel,
}: InteriorHeroProps) {
  return (
    <section className="interior-hero">
      <div className="interior-hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-rule" /> {eyebrow}
        </p>
        <h1>
          {title}
          {accent ? (
            <>
              <br />
              <i>{accent}</i>
            </>
          ) : null}
        </h1>
        <p className="interior-hero-lede">{lead}</p>
        <div className="hero-actions">
          <Link className="button button-brass" href={CONSULTATION_HREF}>
            Schedule a free consultation <ArrowUpRight size={17} />
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link className="text-link" href={secondaryHref}>
              {secondaryLabel} <ArrowUpRight size={15} />
            </Link>
          ) : null}
        </div>
      </div>
      <div className="interior-hero-image">
        <img src={image} alt={imageAlt} />
      </div>
    </section>
  );
}

function SmartLink({ href, children }: { href: string; children: ReactNode }) {
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

export function ContentSection({ section }: { section: PageSectionContent }) {
  const tone = section.tone ?? "paper";

  return (
    <section
      className={`content-section content-section-${tone}`}
      id={section.id}
    >
      <div className="content-section-heading">
        {section.eyebrow ? (
          <p
            className={`eyebrow ${tone === "dark" || tone === "blue" ? "" : "dark"}`}
          >
            <span className="eyebrow-rule" /> {section.eyebrow}
          </p>
        ) : null}
        <h2>{section.title}</h2>
      </div>

      <div className="content-section-body">
        {section.body?.map(paragraph => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {section.bullets ? (
          <ul className="check-list">
            {section.bullets.map(item => (
              <li key={item}>
                <Check size={17} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {section.cards ? (
          <div className="content-card-grid">
            {section.cards.map((card, index) => (
              <article className="content-card" key={card.title}>
                <span className="content-card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                {card.href ? (
                  <SmartLink href={card.href}>
                    {card.linkLabel ?? "Learn more"} <ArrowUpRight size={15} />
                  </SmartLink>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {section.steps ? (
          <ol className="editorial-steps">
            {section.steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {section.note ? <p className="content-note">{section.note}</p> : null}
      </div>
    </section>
  );
}

export function FinalCta({
  title = "A clearer plan can begin with one conversation.",
  body = "Tell us what brings you here. Miranda Law can help you understand the next questions to consider and whether our services fit your needs.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="final-cta">
      <div>
        <p className="eyebrow">
          <span className="eyebrow-rule" /> Start with clarity
        </p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <div className="contact-methods">
        <Link className="button button-brass" href={CONSULTATION_HREF}>
          Schedule a free consultation <ArrowUpRight size={17} />
        </Link>
        <a href={getPhoneHref()}>
          <Phone size={17} /> Call {CONTACT.phoneDisplay}
        </a>
        <a href={getTextHref()}>
          <Smartphone size={17} /> Text the office
        </a>
        <a href={getWhatsAppHref()} target="_blank" rel="noreferrer">
          <MessageCircle size={17} /> WhatsApp
        </a>
      </div>
    </section>
  );
}

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordionSection({
  items,
  title = "Questions are part of good planning.",
  eyebrow = "Frequently asked questions",
}: {
  items: readonly FaqItem[];
  title?: string;
  eyebrow?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section interior-faq-section">
      <div className="faq-intro">
        <p className="eyebrow">
          <span className="eyebrow-rule" /> {eyebrow}
        </p>
        <h2>{title}</h2>
        <p>
          These answers provide general information. Your circumstances may call
          for a different approach.
        </p>
      </div>
      <div className="faq-list">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const answerId = `interior-faq-${index}`;

          return (
            <div
              className={isOpen ? "faq-item is-open" : "faq-item"}
              key={item.question}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() =>
                  setOpenIndex(current => (current === index ? null : index))
                }
              >
                <span>{item.question}</span>
                {isOpen ? <Minus size={18} /> : <ChevronDown size={18} />}
              </button>
              {isOpen ? <p id={answerId}>{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
