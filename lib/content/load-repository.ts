import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import {
  assembleRepositoryContent,
  type RepositoryCollectionDocuments,
  type TranslationDocument,
} from "./collections";

const readYaml = <T>(root: string, relativePath: string) =>
  parse(readFileSync(join(root, "content", relativePath), "utf8")) as T;

const dataDocument = <T>(root: string, relativePath: string) => ({
  ...readYaml<T>(root, relativePath),
  id: relativePath,
  stem: relativePath.replace(/\.yml$/, ""),
});

const directoryDocuments = <T>(root: string, relativeDirectory: string) =>
  readdirSync(join(root, "content", relativeDirectory))
    .filter(fileName => fileName.endsWith(".yml"))
    .sort()
    .map(fileName => dataDocument<T>(root, join(relativeDirectory, fileName)));

const articleDocuments = (root: string) =>
  readdirSync(join(root, "content/blog"))
    .filter(fileName => fileName.endsWith(".md"))
    .sort()
    .map(fileName => {
      const relativePath = join("blog", fileName);
      const source = readFileSync(join(root, "content", relativePath), "utf8");
      const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match)
        throw new Error(`Invalid article front matter: ${relativePath}`);
      return {
        ...(parse(match[1]!) as Record<string, unknown>),
        id: relativePath,
        stem: relativePath.replace(/\.md$/, ""),
        body: match[2]!,
      };
    });

const translationDocuments = (
  root: string,
  locale: "es" | "pt",
  relativeDirectory = ""
): TranslationDocument[] => {
  const directory = join(
    root,
    "content/site/localization",
    locale,
    relativeDirectory
  );
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relativePath = join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      return translationDocuments(root, locale, relativePath);
    }
    return entry.name.endsWith(".yml")
      ? [
          dataDocument<Pick<TranslationDocument, "entries">>(
            root,
            join("site/localization", locale, relativePath)
          ),
        ]
      : [];
  });
};

export function loadRepositoryDocuments(
  root: string
): RepositoryCollectionDocuments {
  return {
    site: [dataDocument(root, "site/shared.yml")],
    home: [dataDocument(root, "site/home.yml")],
    locations: [dataDocument(root, "site/locations.yml")],
    pages: directoryDocuments(root, "site/pages"),
    resourceFaq: [dataDocument(root, "site/resources/faq.yml")],
    resourceChecklist: [dataDocument(root, "site/resources/checklist.yml")],
    resourceVideo: [dataDocument(root, "site/resources/video.yml")],
    blogSettings: [dataDocument(root, "site/blog.yml")],
    contactPage: [dataDocument(root, "site/contact-page.yml")],
    legal: directoryDocuments(root, "site/legal"),
    questionnaire: [dataDocument(root, "site/questionnaire.yml")],
    nextSteps: [dataDocument(root, "site/next-steps.yml")],
    error404: [dataDocument(root, "site/error-404.yml")],
    translationReview: [dataDocument(root, "site/localization/review.yml")],
    translationsEs: translationDocuments(root, "es"),
    translationsPt: translationDocuments(root, "pt"),
    articles: articleDocuments(root),
  } as RepositoryCollectionDocuments;
}

export const loadRepositoryContent = (root: string) =>
  assembleRepositoryContent(loadRepositoryDocuments(root));
