import { ArrowUpRight, Languages, Scale, Star, UserRound } from "lucide-react";
import { Link } from "wouter";
import { SectionEyebrow } from "../SectionEyebrow";

export function HomeTrustStrip() {
  return (
    <section className="home-trust-strip" aria-label="Practice highlights">
      <span>Serving North Jersey families</span>
      <span>Free initial consultation</span>
      <span>English · Español · Português</span>
      <span>Call · Text · WhatsApp</span>
    </section>
  );
}

export function HomeAudienceSections() {
  return (
    <>
      <section className="home-about-section">
        <div className="home-about-mark" aria-hidden="true">
          <UserRound size={35} />
          <span>BM</span>
        </div>
        <div>
          <SectionEyebrow tone="dark">Meet Brian Miranda</SectionEyebrow>
          <h2>
            A practical legal relationship starts with clear communication.
          </h2>
          <p>
            Brian M. Miranda, Esq. leads a North Jersey practice serving
            individuals and families who want direct explanations, responsive
            communication, and a plan grounded in their actual circumstances.
          </p>
          <Link className="text-link dark-link" href="/about">
            Meet Brian <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="home-language-section">
        <div>
          <Languages size={32} />
          <SectionEyebrow>Estate planning in your language</SectionEyebrow>
          <h2>Important decisions deserve language that feels clear.</h2>
          <p>
            Miranda Law communicates with clients in English, Spanish, and
            Portuguese—from the first inquiry through the planning process.
          </p>
        </div>
        <div className="language-card-grid">
          <Link href="/start/en">
            <span>EN</span>
            <strong>English</strong>
          </Link>
          <Link href="/start/es">
            <span>ES</span>
            <strong>Español</strong>
          </Link>
          <Link href="/start/pt">
            <span>PT</span>
            <strong>Português</strong>
          </Link>
        </div>
      </section>

      <section className="home-other-services-section">
        <div>
          <SectionEyebrow tone="dark">Other legal services</SectionEyebrow>
          <h2>Legal guidance for the matters around the plan.</h2>
        </div>
        <div>
          <Scale size={30} />
          <p>
            Miranda Law also assists with select real estate, corporate, civil
            litigation and defense, municipal, immigration, and landlord-tenant
            matters.
          </p>
          <Link className="text-link dark-link" href="/other-services">
            View other services <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="home-reviews-section">
        <div>
          <Star size={28} />
          <p className="eyebrow">
            <span className="eyebrow-rule" /> Client reviews
          </p>
          <h2>Approved client feedback will live here.</h2>
        </div>
        <p>
          This section is ready for verified reviews addressing communication,
          responsiveness, trust, and multilingual service. No testimonial copy
          has been invented for the scaffold.
        </p>
      </section>
    </>
  );
}
