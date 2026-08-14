import { Mail, MapPin, MessageCircle, Phone, Smartphone } from "lucide-react";
import { InteriorHero } from "@/components/site/PageSections";
import { PageShell } from "@/components/site/PageShell";
import {
  CONTACT,
  getPhoneHref,
  getTextHref,
  getWhatsAppHref,
} from "@/site/siteConfig";
import { CONTACT_PAGE } from "./pageContent";

const CONTACT_METHODS = [
  {
    icon: Phone,
    label: "Call",
    value: CONTACT.phoneDisplay,
    href: getPhoneHref(),
  },
  {
    icon: Smartphone,
    label: "Text",
    value: "Send a text message",
    href: getTextHref(),
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Message the legal team",
    href: getWhatsAppHref(),
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
] as const;

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
          {CONTACT_METHODS.map(method => {
            const Icon = method.icon;
            return (
              <a
                href={method.href}
                key={method.label}
                target={method.label === "WhatsApp" ? "_blank" : undefined}
                rel={method.label === "WhatsApp" ? "noreferrer" : undefined}
              >
                <Icon size={22} />
                <span>{method.label}</span>
                <strong>{method.value}</strong>
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
          <MapPin size={24} />
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
