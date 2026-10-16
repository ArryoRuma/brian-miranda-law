import { describe, expect, it } from "vitest";
import {
  createIntakeTimingToken,
  isValidIntakeTimingToken,
  MIN_INTAKE_COMPLETION_TIME_MS,
} from "../../server/utils/intake-protection";

describe("intake submission protection", () => {
  const secret = "test-secret";
  const issuedAt = 10_000;
  const token = createIntakeTimingToken(secret, issuedAt);

  it("rejects submissions completed before the minimum time", () => {
    expect(isValidIntakeTimingToken(token, secret, issuedAt + 2_999)).toBe(
      false
    );
  });

  it("accepts submissions completed at or after the minimum time", () => {
    expect(
      isValidIntakeTimingToken(
        token,
        secret,
        issuedAt + MIN_INTAKE_COMPLETION_TIME_MS
      )
    ).toBe(true);
  });

  it("rejects tampered timing data", () => {
    const [timestamp, nonce, signature] = token.split(".");
    const tamperedToken = `${Number(timestamp) - 1}.${nonce}.${signature}`;
    expect(
      isValidIntakeTimingToken(
        tamperedToken,
        secret,
        issuedAt + MIN_INTAKE_COMPLETION_TIME_MS
      )
    ).toBe(false);
  });

  it("uses the server-issued time rather than a skewed client clock", () => {
    const clientSuppliedStart = issuedAt + 60_000;
    const serverSubmittedAt = issuedAt + 10_000;
    expect(serverSubmittedAt - clientSuppliedStart).toBeLessThan(
      MIN_INTAKE_COMPLETION_TIME_MS
    );
    expect(isValidIntakeTimingToken(token, secret, serverSubmittedAt)).toBe(
      true
    );
  });
});
