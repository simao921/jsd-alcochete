import { Link } from "react-router-dom";
import { Card } from "./Card";
import { formatDate } from "../services/helpers";

export function NewsCard({ article }) {
  return (
    <Card className="h-full space-y-4 border-jsd-orange/12">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-[#fff4e1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-jsd-orange">
          {article.category}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-jsd-black/45 dark:text-white/45">
          {formatDate(article.publishedAt)}
        </span>
      </div>
      <Link to={`/noticias/${article.id}`} className="block group">
        <div className="space-y-3 mt-4">
          <h3 className="font-display text-2xl font-bold text-jsd-blue-dark group-hover:text-jsd-orange transition-colors dark:text-white">{article.title}</h3>
          <p className="copy text-sm">{article.excerpt}</p>
        </div>
      </Link>
      <div className="rounded-[1.5rem] bg-[#fff8ef] p-4 text-sm leading-7 text-jsd-black/75 dark:bg-white/5 dark:text-white/72 mb-2">
        <p className="line-clamp-3">{article.content}</p>
        <Link to={`/noticias/${article.id}`} className="inline-block mt-2 font-bold text-jsd-orange hover:text-jsd-blue-dark transition-colors">Ler mais &rarr;</Link>
      </div>
      <p className="text-sm font-semibold text-jsd-blue-dark dark:text-jsd-orange">Por {article.author}</p>
    </Card>
  );
}
