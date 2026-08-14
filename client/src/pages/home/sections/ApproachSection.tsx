import { ArrowUpRight } from "lucide-react";
import { scrollToSection } from "../navigation";
import { SectionEyebrow } from "../SectionEyebrow";

export function ApproachSection() {
  return (
    <section className="intro-section" id="approach">
      <div className="section-marker">
        02 <span>/</span> Perspective
      </div>
      <div className="intro-content">
        <SectionEyebrow tone="dark">
          A steady hand for important decisions
        </SectionEyebrow>
        <h2>
          Good planning is not about anticipating every outcome.{" "}
          <em>It is about making the important ones easier to navigate.</em>
        </h2>
        <div className="intro-columns">
          <p>
            Estate planning can feel like a task for another day. We make it
            feel more manageable by bringing structure, attention, and
            plainspoken guidance to the process.
          </p>
          <p>
            Our work is centered on understanding your priorities, then shaping
            a plan that reflects them with care. No unnecessary complexity. No
            one-size-fits-all answers.
          </p>
        </div>
        <button
          className="text-link dark-link"
          type="button"
          onClick={() => scrollToSection("process")}
        >
          See how we work <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
