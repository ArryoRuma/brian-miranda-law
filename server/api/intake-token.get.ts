import { createError, defineEventHandler, setHeader } from "h3";
import { createIntakeTimingToken } from "../utils/intake-protection";

export default defineEventHandler(event => {
  setHeader(event, "Cache-Control", "no-store, private");
  const secret = process.env.RESEND_API_KEY;
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: "Intake unavailable" });
  }

  return { token: createIntakeTimingToken(secret) };
});
