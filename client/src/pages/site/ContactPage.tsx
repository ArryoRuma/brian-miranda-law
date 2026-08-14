import { Mail, MapPin, MessageCircle, Phone, Smartphone } from "lucide-react";
import { InteriorHero } from "@/components/site/PageSections";
import { PageShell } from "@/components/site/PageShell";
import { CONTACT_ACTIONS, CONTACT } from "@/site/siteConfig";
import { CONTACT_PAGE } from "./pageContent";

const CONTACT_ICONS = {
  call: Phone,
  text: Smartphone,
  whatsapp: MessageCircle,
  email: Mail,
} as const;

const CONTACT_VALUES = {
  call: CONTACT.phoneDisplay,
  text: "Send a text message",
  whatsapp: "Message on WhatsApp",
  email: CONTACT.email,
} as const;

export default function ContactPage() {
  return (
    <PageShell
      title={CONTACT_PAGE.title}
      description={CONTACT_PAGE.metaDescription}
      path={CONTACT_PAGE.path}
    >
      <InteriorHero {...CONTACT_PAGE.hero} />
      <section className="contact-page-section">
        <div className="contact-page-intro">
          <p className="eyebrow dark">
            <span className="eyebrow-rule" /> Free initial consultation
          </p>
          <h2>Choose the easiest way to reach the office.</h2>
          <p>
            The legal team handles initial intake and scheduling. A first
            conversation helps the firm understand the general nature of your
            matter and determine an appropriate next step.
          </p>
          <p className="content-note">
            Contacting the firm does not create an attorney-client relationship.
            Please do not send confidential or time-sensitive information until
            the firm confirms representation.
          </p>
        </div>
        <div className="contact-option-grid">
          {CONTACT_ACTIONS.map(action => {
            const Icon = CONTACT_ICONS[action.id];
            return (
              <a
                className={
                  action.priority === "primary"
                    ? "contact-option is-primary"
                    : "contact-option"
                }
                href={action.href}
                key={action.id}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noreferrer" : undefined}
                aria-label={action.label}
              >
                <Icon size={22} aria-hidden="true" />
                <span>{action.shortLabel}</span>
                <strong>{CONTACT_VALUES[action.id]}</strong>
              </a>
            );
          })}
        </div>
      </section>

      <section className="office-section">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> Warren office
          </p>
          <h2>Meet by appointment in North Jersey.</h2>
          <p>
            Miranda Law primarily serves clients in Monmouth County and
            communities north of it. Contact the office to arrange a
            consultation.
          </p>
        </div>
        <a
          className="office-address-card"
          href={CONTACT.mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={24} aria-hidden="true" />
          <span>
            {CONTACT.addressLines[0]}
            <br />
            {CONTACT.addressLines[1]}
          </span>
        </a>
      </section>
    </PageShell>
  );
}
