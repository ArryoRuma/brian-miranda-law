import {
  loadRepositoryContent as loadContent,
  loadRepositoryDocuments as loadDocuments,
} from "../../lib/content/load-repository";

export const loadRepositoryDocuments = () => loadDocuments(process.cwd());
export const loadRepositoryContent = () => loadContent(process.cwd());
