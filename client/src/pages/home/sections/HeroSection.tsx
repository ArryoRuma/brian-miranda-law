import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { scrollToSection } from "../navigation";
import { SectionEyebrow } from "../SectionEyebrow";

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <SectionEyebrow>Estate planning, thoughtfully handled</SectionEyebrow>
        <h1>
          Plan with clarity.
          <br />
          <i>Leave with confidence.</i>
        </h1>
        <p className="hero-lede">
          A considered approach to the documents, decisions, and conversations
          that help protect what matters most.
        </p>
        <div className="hero-actions">
          <button
            className="button button-brass"
            type="button"
            onClick={() => scrollToSection("contact")}
          >
            Begin with a conversation <ArrowUpRight size={17} />
          </button>
          <button
            className="text-link"
            type="button"
            onClick={() => scrollToSection("approach")}
          >
            Our approach <span>↗</span>
          </button>
        </div>
        <p className="hero-note">
          <ShieldCheck size={15} /> Clear guidance for the people and future you
          care about.
        </p>
      </div>
      <div className="hero-image-wrap">
        <img
          src="/images/brian-law-hero_7235d741.jpg.webp"
          alt="A warmly lit estate-planning desk with an open folder, fountain pen, brass lamp, and law books"
          className="hero-image"
          fetchPriority="high"
          decoding="async"
        />
        <div className="image-caption">
          <span>Brian Miranda Law</span>
          <span>Private client practice</span>
        </div>
      </div>
      <div className="hero-index">
        01 <span>/</span> 04
      </div>
    </section>
  );
}
