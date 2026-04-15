import { Link, useParams, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { formatDate } from "../services/helpers";
import { ScrollReveal } from "../components/ScrollReveal";

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
    <article className="min-h-screen bg-[#fff8ef] pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <ScrollReveal>
          <Link to="/noticias" className="text-sm font-bold text-jsd-orange uppercase tracking-widest hover:text-jsd-blue-dark transition-colors">
            &larr; Voltar às Notícias
          </Link>
          
          <div className="mt-8 flex flex-wrap items-center gap-4 border-b border-black/10 pb-8">
            <span className="rounded-full bg-jsd-orange/10 text-jsd-orange px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-sm font-semibold text-jsd-black/50 uppercase tracking-widest">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1 className="mt-8 font-display text-4xl md:text-6xl font-black text-jsd-blue-dark leading-tight">
            {article.title}
          </h1>
          
          <div className="mt-8 bg-white p-8 md:p-12 rounded-[2rem] shadow-sm">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-jsd-black/80 mb-10 border-b border-jsd-orange/20 pb-10">
              {article.excerpt}
            </p>
            
            <div className="prose prose-lg prose-p:leading-loose text-jsd-black/75 whitespace-pre-wrap font-sans">
              {article.content}
            </div>
            
            <div className="mt-16 pt-8 border-t border-black/10">
              <p className="text-sm font-bold uppercase tracking-widest text-jsd-black/50">
                Publicado por
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-jsd-blue-dark">
                {article.author}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </article>
  );
}
