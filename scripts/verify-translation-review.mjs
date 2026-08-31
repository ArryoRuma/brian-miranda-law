import { readFileSync } from "node:fs";
import { parse } from "yaml";

const content = parse(readFileSync("content/site.yml", "utf8"));
const reviews = content.localization?.review;

if (!reviews) {
  throw new Error("Translation review metadata is missing");
}

const incomplete = Object.entries(reviews).flatMap(([locale, review]) => {
  const pageEntries = Object.entries(review.pages ?? {});
  const draftPages = pageEntries
    .filter(([, status]) => status !== "approved")
    .map(([path]) => `${locale}:${path}`);

  if (review.status !== "approved" && !draftPages.length) {
    draftPages.push(`${locale}:overall-status`);
  }
  return draftPages;
});

if (incomplete.length) {
  throw new Error(
    `Translation release is blocked pending fluent/legal approval:\n${incomplete.join("\n")}`
  );
}

console.log("Every localized page is approved for release.");
