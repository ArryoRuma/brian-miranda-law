import { describe, expect, it } from "vitest";
import {
  getPhoneHref,
  getTextHref,
  getWhatsAppHref,
  normalizePhoneDigits,
} from "../../app/data/routes";

describe("contact route helpers", () => {
  it("normalizes phone formatting to digits", () => {
    expect(normalizePhoneDigits("+1 (908) 424-1011")).toBe("19084241011");
  });

  it("creates call, text, and WhatsApp links from the same number", () => {
    const phone = "+1 (908) 424-1011";
    expect(getPhoneHref(phone)).toBe("tel:+19084241011");
    expect(getTextHref(phone)).toBe("sms:+19084241011");
    expect(getWhatsAppHref(phone)).toBe("https://wa.me/19084241011");
  });
});
