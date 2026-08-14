import { PROCESS_STEPS, type ProcessStep } from "../content";
import { SectionEyebrow } from "../SectionEyebrow";

type ProcessStepItemProps = {
  step: ProcessStep;
};

function ProcessStepItem({ step }: ProcessStepItemProps) {
  return (
    <div className="process-step">
      <span>{step.number}</span>
      <div>
        <h3>{step.title}</h3>
        <p>{step.description}</p>
      </div>
    </div>
  );
}

export function ProcessSection() {
  return (
    <section className="process-section" id="process">
      <div className="process-image">
        <img
          src="/images/brian-law-detail_25336cb9.jpg.webp"
          alt="A linen-bound planning book resting on layered papers and deep green folders"
          width="1280"
          height="1920"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="process-copy">
        <SectionEyebrow tone="dark">A clear way forward</SectionEyebrow>
        <h2>
          Start where you are.
          <br />
          <em>We will take it from there.</em>
        </h2>
        <div className="process-steps">
          {PROCESS_STEPS.map(step => (
            <ProcessStepItem key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
