import { useEffect } from "react";

const DEFAULT_TITLE = "JSD Alcochete | A voz jovem de Alcochete";
const DEFAULT_DESCRIPTION =
  "Plataforma institucional e de membros da JSD Alcochete, preparada para crescimento político digital.";

const ensureMetaTag = (name, attribute = "name") => {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  return tag;
};

export const useDocumentMeta = ({ title, description, keywords }) => {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;

    const descriptionTag = ensureMetaTag("description");
    descriptionTag.setAttribute("content", description || DEFAULT_DESCRIPTION);

    if (keywords) {
      const keywordsTag = ensureMetaTag("keywords");
      keywordsTag.setAttribute("content", keywords);
    }

    const ogTitle = ensureMetaTag("og:title", "property");
    ogTitle.setAttribute("content", title || DEFAULT_TITLE);

    const ogDescription = ensureMetaTag("og:description", "property");
    ogDescription.setAttribute("content", description || DEFAULT_DESCRIPTION);
  }, [description, keywords, title]);
};
