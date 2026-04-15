import { useDeferredValue, useMemo, useState } from "react";

import { Card } from "../components/Card";
import { NewsCard } from "../components/NewsCard";
import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn, normaliseText } from "../services/helpers";

export function NewsPage() {
  const { news } = useApp();
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const categories = useMemo(() => ["Todas", ...new Set(news.map((article) => article.category))], [news]);
  const filteredNews = useMemo(() => {
    const query = normaliseText(deferredSearch);

    return news.filter((article) => {
      const matchesCategory = activeCategory === "Todas" || article.category === activeCategory;
      const matchesSearch =
        !query ||
        normaliseText(article.title).includes(query) ||
        normaliseText(article.excerpt).includes(query) ||
        normaliseText(article.content).includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, deferredSearch, news]);

  useDocumentMeta({
    title: "Notícias | JSD Alcochete",
    description: "Artigos dinâmicos de atividades, opinião e comunicados da JSD Alcochete.",
    keywords: "notícias JSD Alcochete, atividades, opinião, comunicados"
  });

  return (
    <>
      <PageBanner
        label="Notícias"
        title="Atualidade, posição e intervenção pública"
        description="Acompanha a atividade da JSD Alcochete, os comunicados e os textos de opinião da estrutura."
      />

      <section className="section-shell pt-0">
        <ScrollReveal>
          <Card className="mb-8 border-jsd-orange/12 bg-[#fff8ef]">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <input
                type="search"
                className="input"
                placeholder="Pesquisar notícias por tema, posição ou destaque"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn("chip", activeCategory === category && "chip-active")}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredNews.map((article) => (
            <ScrollReveal key={article.id}>
              <NewsCard article={article} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
