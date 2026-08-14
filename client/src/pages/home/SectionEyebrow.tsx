import type { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  tone?: "light" | "dark";
};

export function SectionEyebrow({
  children,
  tone = "light",
}: SectionEyebrowProps) {
  const className = tone === "dark" ? "eyebrow dark" : "eyebrow";

  return (
    <p className={className}>
      <span className="eyebrow-rule" /> {children}
    </p>
  );
}
