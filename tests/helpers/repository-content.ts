import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import {
  assembleRepositoryContent,
  type RepositoryCollectionDocuments,
  type TranslationDocument,
} from "../../lib/content/collections";

const root = process.cwd();

const readYaml = <T>(relativePath: string) =>
  parse(readFileSync(join(root, "content", relativePath), "utf8")) as T;

const dataDocument = <T>(relativePath: string) => ({
  ...readYaml<T>(relativePath),
  id: relativePath,
  stem: relativePath.replace(/\.yml$/, ""),
});

const directoryDocuments = <T>(relativeDirectory: string) =>
  readdirSync(join(root, "content", relativeDirectory))
    .filter(fileName => fileName.endsWith(".yml"))
    .sort()
    .map(fileName => dataDocument<T>(join(relativeDirectory, fileName)));

const translationDocuments = (
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
      return translationDocuments(locale, relativePath);
    }
    return entry.name.endsWith(".yml")
      ? [
          dataDocument<Pick<TranslationDocument, "entries">>(
            join("site/localization", locale, relativePath)
          ),
        ]
      : [];
  });
};

export function loadRepositoryDocuments(): RepositoryCollectionDocuments {
  return {
    site: [dataDocument("site/shared.yml")],
    home: [dataDocument("site/home.yml")],
    pages: directoryDocuments("site/pages"),
    resourceFaq: [dataDocument("site/resources/faq.yml")],
    resourceChecklist: [dataDocument("site/resources/checklist.yml")],
    resourceVideo: [dataDocument("site/resources/video.yml")],
    blogSettings: [dataDocument("site/blog.yml")],
    contactPage: [dataDocument("site/contact-page.yml")],
    legal: directoryDocuments("site/legal"),
    questionnaire: [dataDocument("site/questionnaire.yml")],
    nextSteps: [dataDocument("site/next-steps.yml")],
    error404: [dataDocument("site/error-404.yml")],
    translationReview: [dataDocument("site/localization/review.yml")],
    translationsEs: translationDocuments("es"),
    translationsPt: translationDocuments("pt"),
    articles: [],
  } as RepositoryCollectionDocuments;
}

export const loadRepositoryContent = () =>
  assembleRepositoryContent(loadRepositoryDocuments());
