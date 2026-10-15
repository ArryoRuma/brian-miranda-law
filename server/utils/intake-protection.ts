export const MIN_INTAKE_COMPLETION_TIME_MS = 3_000;

export const isIntakeSubmissionTooFast = (
  startedAt: number,
  submittedAt = Date.now()
) => submittedAt - startedAt < MIN_INTAKE_COMPLETION_TIME_MS;
