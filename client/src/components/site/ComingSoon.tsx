import type { ReactNode } from "react";

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  body: string;
  icon?: ReactNode;
  className?: string;
};

export function ComingSoon({
  eyebrow,
  title,
  body,
  icon,
  className = "",
}: ComingSoonProps) {
  return (
    <div className={`coming-soon-panel ${className}`.trim()}>
      {icon ? <div className="coming-soon-icon">{icon}</div> : null}
      <p className="eyebrow">
        <span className="eyebrow-rule" /> {eyebrow}
      </p>
      <h2>{title}</h2>
      <p>{body}</p>
      <span className="coming-soon-status">Coming soon</span>
    </div>
  );
}
