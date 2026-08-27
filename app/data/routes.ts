export const normalizePhoneDigits = (phone: string) => phone.replace(/\D/g, "");

const getInternationalPhone = (phone: string) =>
  `+${normalizePhoneDigits(phone)}`;

export const getPhoneHref = (phone: string) =>
  `tel:${getInternationalPhone(phone)}`;
export const getTextHref = (phone: string) =>
  `sms:${getInternationalPhone(phone)}`;
export const getWhatsAppHref = (phone: string) =>
  `https://wa.me/${normalizePhoneDigits(phone)}`;
