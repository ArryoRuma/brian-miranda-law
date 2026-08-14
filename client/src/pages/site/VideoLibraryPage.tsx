import { Play } from "lucide-react";
import { ComingSoon } from "@/components/site/ComingSoon";
import { FinalCta, InteriorHero } from "@/components/site/PageSections";
import { PageShell } from "@/components/site/PageShell";

const VIDEO_TOPICS = [
  {
    title: "Do I need an estate plan if I am not wealthy?",
    summary:
      "Why decision-makers, incapacity, children, and personal property matter at many asset levels.",
  },
  {
    title: "What does a will actually control?",
    summary:
      "A plain-language look at wills, beneficiary designations, joint ownership, and probate property.",
  },
  {
    title: "When might a trust be useful?",
    summary:
      "Questions to consider when property needs management, timing, or continuity beyond a simple transfer.",
  },
  {
    title: "Who should I name as power of attorney?",
    summary:
      "Practical factors to consider when choosing a financial agent and a backup.",
  },
  {
    title: "Health care proxy or living will?",
    summary:
      "How New Jersey's proxy and instruction directives answer different planning questions.",
  },
  {
    title: "What should I bring to a consultation?",
    summary:
      "A simple way to organize documents, family information, assets, and questions without over-preparing.",
  },
] as const;

export default function VideoLibraryPage() {
  return (
    <PageShell
      title="Estate Planning Video Library"
      description="Explore Miranda Law's planned video topics covering wills, trusts, powers of attorney, health care directives, and consultation preparation."
      path="/resources/video-blog"
    >
      <InteriorHero
        eyebrow="Estate planning video library"
        title="Short explanations for"
        accent="important planning questions."
        lead="This library is being prepared as a plain-language companion to the estate-planning pages and consultation checklist."
        secondaryHref="/resources/estate-planning-faqs"
        secondaryLabel="Read answers now"
      />
      <section className="video-library-section">
        <ComingSoon
          className="video-library-heading"
          eyebrow="Planned video topics"
          title="Questions worth explaining carefully."
          body="Videos will be published after attorney review and recording. The topics below preview the initial educational library."
          icon={<Play size={26} aria-hidden="true" />}
        />
        <div className="video-topic-grid">
          {VIDEO_TOPICS.map((topic, index) => (
            <article key={topic.title}>
              <div className="video-placeholder" aria-hidden="true">
                <Play size={24} aria-hidden="true" />
                <span>Video {String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.summary}</p>
              <span className="coming-soon">
                Attorney review & recording pending
              </span>
            </article>
          ))}
        </div>
      </section>
      <FinalCta />
    </PageShell>
  );
}
