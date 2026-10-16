import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const MIN_INTAKE_COMPLETION_TIME_MS = 3_000;
const MAX_INTAKE_TOKEN_AGE_MS = 24 * 60 * 60 * 1_000;

export const createIntakeTimingToken = (
  secret: string,
  issuedAt = Date.now()
) => {
  const payload = `${issuedAt}.${randomBytes(16).toString("base64url")}`;
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
};

export const isValidIntakeTimingToken = (
  token: string,
  secret: string,
  submittedAt = Date.now()
) => {
  const [issuedAtValue, nonce, signature, ...extra] = token.split(".");
  if (
    extra.length ||
    !/^\d+$/.test(issuedAtValue ?? "") ||
    !/^[A-Za-z0-9_-]{22}$/.test(nonce ?? "") ||
    !/^[A-Za-z0-9_-]{43}$/.test(signature ?? "")
  ) {
    return false;
  }

  const issuedAt = Number(issuedAtValue);
  const elapsed = submittedAt - issuedAt;
  if (
    !Number.isSafeInteger(issuedAt) ||
    elapsed < MIN_INTAKE_COMPLETION_TIME_MS ||
    elapsed > MAX_INTAKE_TOKEN_AGE_MS
  ) {
    return false;
  }

  const payload = `${issuedAtValue}.${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const provided = Buffer.from(signature ?? "", "base64url");
  return (
    provided.length === expected.length && timingSafeEqual(provided, expected)
  );
};
