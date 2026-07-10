import { Link } from "react-router-dom";

import { Card } from "./Card";
import { formatDate } from "../services/helpers";

export function NewsCard({ article }) {
  return (
    <Card className="h-full space-y-4 border-jsd-orange/15 hover:border-jsd-orange/30 transition-colors duration-300 group">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-jsd-orange border border-jsd-orange/20 bg-jsd-orange/10 px-3 py-1">
          {article.category}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-white/45">
          {formatDate(article.publishedAt)}
        </span>
      </div>
      <Link to={`/noticias/${article.id}`} className="block">
        <div className="space-y-3 mt-2">
          <h3 className="font-display text-2xl font-bold text-white group-hover:text-jsd-orange transition-colors">
            {article.title}
          </h3>
          <p className="text-sm leading-relaxed text-white/65">{article.excerpt}</p>
        </div>
      </Link>
      <div className="border border-white/5 bg-white/[0.02] p-4 text-sm leading-7 text-white/60">
        <p className="line-clamp-3">{article.content}</p>
        <Link
          to={`/noticias/${article.id}`}
          className="inline-block mt-3 font-bold text-jsd-orange hover:text-white transition-colors text-xs uppercase tracking-widest"
        >
          Ler mais &rarr;
        </Link>
      </div>
      <p className="text-sm font-semibold text-jsd-orange/80">Por {article.author}</p>
    </Card>
  );
}
