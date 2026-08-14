/* Quiet Authority: editorial estate-planning landing page with asymmetric reading rhythm, paper-toned panels, brass rules, and restrained motion. */
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X, ShieldCheck, FileText, Users, Compass, Check, Minus } from "lucide-react";

const navItems = ["Approach", "Services", "Process", "Contact"];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <div className="site-shell">
      <div className="desktop-rail" aria-hidden="true"><span className="rail-mark">BM</span><span className="rail-line" /><span className="rail-label">Brian Miranda Law</span></div>
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Brian Miranda Law home">
          <span className="brand-mark" aria-hidden="true"><span>B</span><span>M</span></span>
          <span className="brand-name"><strong>Brian Miranda</strong><em>Law</em></span>
        </a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {navItems.map((item) => <button key={item} onClick={() => go(item.toLowerCase())}>{item}</button>)}
          <button className="nav-cta" onClick={() => go("contact")}>Start a conversation <ArrowUpRight size={15} /></button>
        </nav>
        <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-rule" /> Estate planning, thoughtfully handled</p>
            <h1>Plan with clarity.<br /><i>Leave with confidence.</i></h1>
            <p className="hero-lede">A considered approach to the documents, decisions, and conversations that help protect what matters most.</p>
            <div className="hero-actions">
              <button className="button button-brass" onClick={() => go("contact")}>Begin with a conversation <ArrowUpRight size={17} /></button>
              <button className="text-link" onClick={() => go("approach")}>Our approach <span>↗</span></button>
            </div>
            <p className="hero-note"><ShieldCheck size={15} /> Clear guidance for the people and future you care about.</p>
          </div>
          <div className="hero-image-wrap">
            <img src="/manus-storage/brian-law-hero_7235d741.jpg" alt="A quiet study with an open folder and fountain pen" className="hero-image" />
            <div className="image-caption"><span>Brian Miranda Law</span><span>Private client practice</span></div>
          </div>
          <div className="hero-index">01 <span>/</span> 04</div>
        </section>

        <section className="intro-section" id="approach">
          <div className="section-marker">02 <span>/</span> Perspective</div>
          <div className="intro-content">
            <p className="eyebrow dark"><span className="eyebrow-rule" /> A steady hand for important decisions</p>
            <h2>Good planning is not about anticipating every outcome. <em>It is about making the important ones easier to navigate.</em></h2>
            <div className="intro-columns">
              <p>Estate planning can feel like a task for another day. We make it feel more manageable by bringing structure, attention, and plainspoken guidance to the process.</p>
              <p>Our work is centered on understanding your priorities, then shaping a plan that reflects them with care. No unnecessary complexity. No one-size-fits-all answers.</p>
            </div>
            <button className="text-link dark-link" onClick={() => go("process")}>See how we work <ArrowUpRight size={16} /></button>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading-row">
            <div><p className="eyebrow dark"><span className="eyebrow-rule" /> Focused counsel</p><h2>What we help you put in place.</h2></div>
            <p className="section-aside">A strong plan is both practical and personal. Our services are designed to give each the attention it deserves.</p>
          </div>
          <div className="services-list">
            {[{ icon: FileText, n: "01", title: "Wills & trusts", copy: "Thoughtful documents that express your wishes and help your loved ones move forward with clarity." }, { icon: Users, n: "02", title: "Family & legacy planning", copy: "A plan that accounts for the people, relationships, and responsibilities that make your family unique." }, { icon: Compass, n: "03", title: "Guidance through change", copy: "Review and refinement when life shifts, so your plan continues to reflect what matters now." }].map(({ icon: Icon, n, title, copy }) => (
              <article className="service-card" key={n}><div className="service-top"><span className="service-number">{n}</span><Icon size={25} strokeWidth={1.4} /></div><h3>{title}</h3><p>{copy}</p><button className="card-arrow" onClick={() => go("contact")} aria-label={`Learn more about ${title}`}><ArrowUpRight size={18} /></button></article>
            ))}
          </div>
        </section>

        <section className="quote-section">
          <div className="quote-offset"><span className="section-marker">03 <span>/</span> A guiding principle</span><div className="quote-stamp">BM<br /><span>Law</span></div></div>
          <blockquote>“The best plans give people something more valuable than paperwork: <em>peace of mind.</em>”</blockquote>
          <div className="quote-line" />
        </section>

        <section className="process-section" id="process">
          <div className="process-image"><img src="/manus-storage/brian-law-detail_25336cb9.jpg" alt="Archival documents and a linen-bound record book" /></div>
          <div className="process-copy"><p className="eyebrow dark"><span className="eyebrow-rule" /> A clear way forward</p><h2>Start where you are.<br /><em>We will take it from there.</em></h2>
            <div className="process-steps">{[{ n: "01", title: "Listen", copy: "We begin with your priorities, questions, and the people you want to protect." }, { n: "02", title: "Shape", copy: "We translate those priorities into a plan that is clear, cohesive, and built for real life." }, { n: "03", title: "Carry forward", copy: "You leave with documents you understand and a plan you can return to as life changes." }].map((step) => <div className="process-step" key={step.n}><span>{step.n}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></div>)}</div>
          </div>
        </section>

        <section className="faq-section">
          <div className="faq-intro"><p className="eyebrow"><span className="eyebrow-rule" /> A few first questions</p><h2>Clarity is a good place to begin.</h2><p>Have a question that is not here? We are glad to start there, too.</p><button className="text-link" onClick={() => go("contact")}>Ask a question <ArrowUpRight size={16} /></button></div>
          <div className="faq-list">{["When should I begin estate planning?", "What should I bring to an initial conversation?", "How often should I review my plan?", "Can you help my family understand the documents?"] .map((q, i) => <div className={openFaq === i ? "faq-item is-open" : "faq-item"} key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{q}</span>{openFaq === i ? <Minus size={18} /> : <ChevronDown size={18} />}</button>{openFaq === i && <p>There is no single right moment. A first conversation is simply a way to understand what you have in place, what has changed, and what you may want to consider next.</p>}</div>)}</div>
        </section>

        <section className="contact-section" id="contact"><div className="contact-inner"><div><p className="eyebrow"><span className="eyebrow-rule" /> The next step can be simple</p><h2>Let’s make a thoughtful plan.</h2><p className="contact-lede">Tell us a little about what brings you here. We will be in touch to arrange a private introductory conversation.</p></div><div className="contact-card"><p className="contact-card-label">Begin here</p><a href="mailto:hello@brianmirandalaw.com">hello@brianmirandalaw.com <ArrowUpRight size={17} /></a><div className="contact-rule" /><p>New client conversations are scheduled by appointment.</p></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark small"><span>B</span><span>M</span></span><span><strong>Brian Miranda</strong><em>Law</em></span></div><p>Estate planning, thoughtfully handled.</p><div className="footer-meta"><span>© 2026 Brian Miranda Law</span><span>Privacy</span><span>Accessibility</span></div></footer>
    </div>
  );
}
