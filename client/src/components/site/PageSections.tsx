import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Mail,
  MessageCircle,
  Minus,
} from "lucide-react";
import { Link } from "wouter";
import { CONTACT_ACTIONS } from "@/site/siteConfig";
import { PrimaryContactActions } from "./ContactActions";

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
          <PrimaryContactActions />
          {secondaryHref && secondaryLabel ? (
            <Link className="text-link" href={secondaryHref}>
              {secondaryLabel} <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
      <div className="interior-hero-image">
        <img
          src={image}
          alt={imageAlt}
          width="1920"
          height="1280"
          fetchPriority="high"
          decoding="async"
        />
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
                    {card.linkLabel ?? "Learn more"}{" "}
                    <ArrowUpRight size={15} aria-hidden="true" />
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
        <PrimaryContactActions />
        <div className="secondary-contact-actions">
          <a
            href={CONTACT_ACTIONS[2].href}
            target="_blank"
            rel="noreferrer"
            aria-label={CONTACT_ACTIONS[2].label}
          >
            <MessageCircle size={17} aria-hidden="true" /> WhatsApp
          </a>
          <a
            href={CONTACT_ACTIONS[3].href}
            aria-label={CONTACT_ACTIONS[3].label}
          >
            <Mail size={17} aria-hidden="true" /> Email
          </a>
        </div>
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
  idPrefix = "interior-faq",
}: {
  items: readonly FaqItem[];
  title?: string;
  eyebrow?: string;
  idPrefix?: string;
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
          const answerId = `${idPrefix}-${index}`;

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
                {isOpen ? (
                  <Minus size={18} aria-hidden="true" />
                ) : (
                  <ChevronDown size={18} aria-hidden="true" />
                )}
              </button>
              {isOpen ? <p id={answerId}>{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
