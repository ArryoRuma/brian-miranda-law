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
