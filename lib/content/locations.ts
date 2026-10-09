export function formatLocationCopy(
  template: string,
  values: { municipality?: string; county?: string }
) {
  return template
    .replaceAll("{municipality}", values.municipality ?? "")
    .replaceAll("{county}", values.county ?? "");
}
