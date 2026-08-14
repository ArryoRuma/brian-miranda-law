import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { SERVICES, type Service } from "../content";
import { SectionEyebrow } from "../SectionEyebrow";

type ServiceCardProps = {
  service: Service;
};

function ServiceCard({ service }: ServiceCardProps) {
  const { icon: Icon, number, title, description, href } = service;

  return (
    <article className="service-card">
      <div className="service-top">
        <span className="service-number">{number}</span>
        <Icon size={25} strokeWidth={1.4} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link
        className="card-arrow"
        aria-label={`Learn more about ${title}`}
        href={href}
      >
        <ArrowUpRight size={18} />
      </Link>
    </article>
  );
}

export function ServicesSection() {
  return (
    <section className="services-section" id="services">
      <div className="section-heading-row">
        <div>
          <SectionEyebrow tone="dark">Focused counsel</SectionEyebrow>
          <h2>What we help you put in place.</h2>
        </div>
        <p className="section-aside">
          A strong plan is both practical and personal. Our services are
          designed to give each the attention it deserves.
        </p>
      </div>
      <div className="services-list">
        {SERVICES.map(service => (
          <ServiceCard key={service.number} service={service} />
        ))}
      </div>
    </section>
  );
}
