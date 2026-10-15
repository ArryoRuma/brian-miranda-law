import { describe, expect, it } from "vitest";
import {
  isIntakeSubmissionTooFast,
  MIN_INTAKE_COMPLETION_TIME_MS,
} from "../../server/utils/intake-protection";

describe("intake submission protection", () => {
  it("rejects submissions completed before the minimum time", () => {
    expect(isIntakeSubmissionTooFast(10_000, 12_999)).toBe(true);
  });

  it("accepts submissions completed at or after the minimum time", () => {
    expect(
      isIntakeSubmissionTooFast(10_000, 10_000 + MIN_INTAKE_COMPLETION_TIME_MS)
    ).toBe(false);
    expect(
      isIntakeSubmissionTooFast(
        10_000,
        10_000 + MIN_INTAKE_COMPLETION_TIME_MS + 1
      )
    ).toBe(false);
  });

  it("rejects future start times", () => {
    expect(isIntakeSubmissionTooFast(11_000, 10_000)).toBe(true);
  });
});
