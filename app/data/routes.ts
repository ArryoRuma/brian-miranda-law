export const PUBLIC_ROUTES = [
  "/",
  "/estate-planning",
  "/estate-planning/wills",
  "/estate-planning/trusts",
  "/estate-planning/powers-of-attorney",
  "/estate-planning/health-care-directives",
  "/about",
  "/resources",
  "/resources/estate-planning-faqs",
  "/resources/estate-planning-checklist",
  "/resources/video-blog",
  "/other-services",
  "/contact",
  "/privacy",
  "/cookies",
  "/disclaimer",
  "/accessibility",
] as const;

export const getPhoneHref = (phone: string) => `tel:${phone}`;
export const getTextHref = (phone: string) => `sms:${phone}`;
export const getWhatsAppHref = (phone: string) =>
  `https://wa.me/${phone.replace("+", "")}`;
