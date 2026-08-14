import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { PrimaryContactActions } from "@/components/site/ContactActions";
import { SectionEyebrow } from "../SectionEyebrow";

export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div>
          <SectionEyebrow>The next step can be simple</SectionEyebrow>
          <h2>Let’s make a thoughtful plan.</h2>
          <p className="contact-lede">
            Tell us a little about what brings you here. We will be in touch to
            arrange a private introductory conversation.
          </p>
        </div>
        <div className="contact-card">
          <p className="contact-card-label">Contact Brian directly</p>
          <PrimaryContactActions />
          <div className="contact-rule" />
          <p>
            Prefer WhatsApp or email?{" "}
            <Link href="/contact">
              View every contact option{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
