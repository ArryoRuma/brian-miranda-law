import { MessageSquareText, Phone } from "lucide-react";
import { CONTACT_ACTIONS } from "@/site/siteConfig";

type PrimaryContactActionsProps = {
  className?: string;
  compact?: boolean;
  callLabel?: string;
  textLabel?: string;
};

export function PrimaryContactActions({
  className = "",
  compact = false,
  callLabel,
  textLabel,
}: PrimaryContactActionsProps) {
  const [callAction, textAction] = CONTACT_ACTIONS;

  return (
    <div
      className={`primary-contact-actions${compact ? " is-compact" : ""} ${className}`.trim()}
      aria-label="Contact Brian Miranda"
    >
      <a
        className="contact-action contact-action-call"
        href={callAction.href}
        aria-label={callAction.label}
      >
        <Phone size={18} aria-hidden="true" />
        <span>{callLabel ?? callAction.shortLabel}</span>
      </a>
      <a
        className="contact-action contact-action-text"
        href={textAction.href}
        aria-label={textAction.label}
      >
        <MessageSquareText size={18} aria-hidden="true" />
        <span>{textLabel ?? textAction.shortLabel}</span>
      </a>
    </div>
  );
}

export function MobileContactBar() {
  return (
    <aside className="mobile-contact-bar" aria-label="Quick contact options">
      <PrimaryContactActions compact />
    </aside>
  );
}
