export const SITE_URL = "https://bmirandalaw.com";

export const CONTACT = {
  name: "The Law Offices of Brian M. Miranda, Esq., LLC",
  shortName: "Miranda Law",
  attorney: "Brian M. Miranda, Esq.",
  email: "bmiranda@bmirandalaw.com",
  phoneDisplay: "908-424-1011",
  phoneHref: "+19084241011",
  alternatePhoneDisplay: "908-800-1856",
  alternatePhoneHref: "+19088001856",
  addressLines: ["172 Washington Valley Road, Suite 3", "Warren, NJ 07059"],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=172+Washington+Valley+Road+Suite+3+Warren+NJ+07059",
} as const;

export type NavigationItem = {
  label: string;
  href: string;
  children?: readonly NavigationItem[];
};

export type ContactAction = {
  id: "call" | "text" | "whatsapp" | "email";
  label: string;
  shortLabel: string;
  href: string;
  priority: "primary" | "secondary";
  external?: boolean;
};

export const PRIMARY_NAVIGATION = [
  { label: "Estate Planning", href: "/estate-planning" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Other Services", href: "/other-services" },
  { label: "Contact", href: "/contact" },
] as const;

export const ESTATE_PLANNING_NAVIGATION = [
  { label: "Estate Planning", href: "/estate-planning" },
  { label: "Wills", href: "/estate-planning/wills" },
  { label: "Trusts", href: "/estate-planning/trusts" },
  {
    label: "Powers of Attorney",
    href: "/estate-planning/powers-of-attorney",
  },
  {
    label: "Health Care Directives",
    href: "/estate-planning/health-care-directives",
  },
] as const;

export const RESOURCE_NAVIGATION = [
  {
    label: "Estate Planning FAQs",
    href: "/resources/estate-planning-faqs",
  },
  {
    label: "Estate Planning Checklist",
    href: "/resources/estate-planning-checklist",
  },
  { label: "Video Library", href: "/resources/video-blog" },
] as const;

export const LANGUAGE_LINKS = [
  { label: "EN", href: "/start/en", language: "English" },
  { label: "ES", href: "/start/es", language: "Español" },
  { label: "PT", href: "/start/pt", language: "Português" },
] as const;

export const CONSULTATION_HREF = "/contact";

export function getPhoneHref() {
  return `tel:${CONTACT.phoneHref}`;
}

export function getTextHref() {
  return `sms:${CONTACT.phoneHref}`;
}

export function getWhatsAppHref() {
  return `https://wa.me/${CONTACT.phoneHref.replace("+", "")}`;
}

export const CONTACT_ACTIONS: readonly ContactAction[] = [
  {
    id: "call",
    label: `Call Brian at ${CONTACT.phoneDisplay}`,
    shortLabel: "Call Brian",
    href: getPhoneHref(),
    priority: "primary",
  },
  {
    id: "text",
    label: `Text Brian at ${CONTACT.phoneDisplay}`,
    shortLabel: "Text Brian",
    href: getTextHref(),
    priority: "primary",
  },
  {
    id: "whatsapp",
    label: "Message Brian on WhatsApp",
    shortLabel: "WhatsApp",
    href: getWhatsAppHref(),
    priority: "secondary",
    external: true,
  },
  {
    id: "email",
    label: `Email ${CONTACT.email}`,
    shortLabel: "Email",
    href: `mailto:${CONTACT.email}`,
    priority: "secondary",
  },
] as const;

export const SITE_NAVIGATION = [
  {
    ...PRIMARY_NAVIGATION[0],
    children: ESTATE_PLANNING_NAVIGATION.slice(1),
  },
  ...PRIMARY_NAVIGATION.slice(1),
] as const satisfies readonly NavigationItem[];
