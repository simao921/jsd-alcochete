import { Link, useParams, Navigate } from "react-router-dom";

import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { formatDate } from "../services/helpers";

export function NewsArticlePage() {
  const { id } = useParams();
  const { news } = useApp();

  const article = news.find((item) => item.id === id);

  useDocumentMeta({
    title: article ? `${article.title} | JSD Alcochete` : "Notícia não encontrada",
    description: article?.excerpt || "Ler artigo completo na JSD Alcochete."
  });

  if (!article) {
    return <Navigate to="/noticias" />;
  }

  return (
    <article>
      <div className="section-shell pb-8">
        <ScrollReveal>
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-sm font-bold text-jsd-orange uppercase tracking-widest hover:text-white transition-colors"
          >
            &larr; Voltar às Notícias
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="eyebrow">{article.category}</span>
            <span className="text-sm font-semibold text-white/50 uppercase tracking-widest">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            {article.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">{article.excerpt}</p>
        </ScrollReveal>
      </div>

      <div className="section-shell pt-0 pb-20">
        <ScrollReveal>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
            <div className="text-base md:text-lg leading-loose text-white/75 whitespace-pre-wrap font-sans">
              {article.content}
            </div>

            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">Publicado por</p>
              <p className="mt-2 font-display text-2xl font-bold text-jsd-orange">{article.author}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </article>
  );
}
