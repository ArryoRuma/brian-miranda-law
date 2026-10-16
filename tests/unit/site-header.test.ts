import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  join(process.cwd(), "app/assets/css/main.css"),
  "utf8"
);

describe("site header layout", () => {
  it("keeps the sticky header outside a scroll container", () => {
    expect(stylesheet).toMatch(/\.site-shell\s*\{[^}]*\boverflow:\s*clip;/s);
    expect(stylesheet).toMatch(
      /\.site-header\s*\{[^}]*\bposition:\s*sticky;[^}]*\btop:\s*0;/s
    );
  });
});
