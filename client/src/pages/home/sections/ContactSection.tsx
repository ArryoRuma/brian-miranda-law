import { ArrowUpRight } from "lucide-react";
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
          <p className="contact-card-label">Begin here</p>
          <a href="mailto:hello@brianmirandalaw.com">
            hello@brianmirandalaw.com <ArrowUpRight size={17} />
          </a>
          <div className="contact-rule" />
          <p>New client conversations are scheduled by appointment.</p>
        </div>
      </div>
    </section>
  );
}
