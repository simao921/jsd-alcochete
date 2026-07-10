import { Link } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { formatDate } from "../services/helpers";

const quickLinks = [
  { to: "/sobre", label: "Quem Somos", desc: "História e valores" },
  { to: "/orgaos", label: "Órgãos", desc: "A nossa equipa" },
  { to: "/eventos", label: "Eventos", desc: "Agenda pública" },
  { to: "/noticias", label: "Notícias", desc: "Comunicados" }
];

function getDay(isoString) {
  if (!isoString) return "--";
  const d = new Date(isoString);
  if (isNaN(d.valueOf())) return "--";
  return d.toLocaleDateString("pt-PT", { day: "2-digit" });
}

function getMonth(isoString) {
  if (!isoString) return "---";
  const d = new Date(isoString);
  if (isNaN(d.valueOf())) return "---";
  return d.toLocaleDateString("pt-PT", { month: "short" }).replace(".", "");
}

export function HomePage() {
  const { news, events } = useApp();

  useDocumentMeta({
    title: "JSD Alcochete | Coragem para Mudar",
    description: "Site oficial da JSD Alcochete. Fica a par das nossas atividades e vem fazer parte da estrutura.",
    keywords: "JSD Alcochete, juventude social democrata, militantes, política local"
  });

  return (
    <div className="bg-[#080401] text-[#fffcf9]">
      <HeroSection />

      {/* Quick links */}
      <section className="section-shell pt-10 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((item) => (
            <ScrollReveal key={item.to}>
              <Link to={item.to} className="panel-hover group block h-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-jsd-orange">{item.label}</p>
                <p className="mt-2 font-display text-lg font-bold text-white group-hover:text-jsd-orange transition">{item.desc}</p>
                <span className="mt-4 inline-block text-white/30 group-hover:text-jsd-orange transition">&rarr;</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="home-content" className="section-shell pt-6 grid lg:grid-cols-2 gap-8">
        <div className="panel flex flex-col h-full">
          <ScrollReveal className="border-b border-white/8 pb-6 mb-6">
            <span className="eyebrow">Comunicados</span>
            <h2 className="section-title mt-4">O que defendemos</h2>
            <p className="copy mt-3">Tomadas de posição, opiniões e comunicados sobre o rumo de Alcochete.</p>
          </ScrollReveal>

          {news.length === 0 ? (
            <p className="text-white/40 py-6">Sem publicações recentes. Fica atento!</p>
          ) : (
            <div className="flex flex-col gap-6 flex-1">
              {news.slice(0, 3).map((article) => (
                <ScrollReveal key={article.id} className="group border-b border-white/5 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-jsd-orange tracking-widest uppercase">{formatDate(article.publishedAt)}</span>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/45">{article.category}</span>
                  </div>
                  <Link to={`/noticias/${article.id}`}>
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-jsd-orange transition">{article.title}</h3>
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-white/55 line-clamp-2">{article.excerpt}</p>
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal className="mt-auto pt-6">
            <Link to="/noticias" className="link-arrow">Ver todas as notícias <span>&rarr;</span></Link>
          </ScrollReveal>
        </div>

        <div className="panel flex flex-col h-full">
          <ScrollReveal className="border-b border-white/8 pb-6 mb-6">
            <span className="eyebrow">Debate & Participação</span>
            <h2 className="section-title mt-4">Vem debater connosco</h2>
            <p className="copy mt-3">Sessões abertas a todos os jovens. Junta-te à discussão cívica.</p>
          </ScrollReveal>

          <div className="flex flex-col gap-3 flex-1">
            {events.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
                <p className="text-white/40">Agenda em preparação. Volta em breve!</p>
              </div>
            ) : (
              events.slice(0, 3).map((event) => (
                <ScrollReveal key={event.id} className="panel-hover flex items-center gap-4 !p-4">
                  <div className="flex flex-col items-center justify-center min-w-[56px] rounded-xl bg-jsd-orange/10 border border-jsd-orange/20 px-3 py-2">
                    <span className="text-jsd-orange font-black text-lg leading-none">{getDay(event.date)}</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/45 mt-0.5">{getMonth(event.date)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-white leading-tight line-clamp-1">{event.title}</h3>
                    <p className="mt-1 text-xs text-white/45 truncate">
                      <span className="text-jsd-orange/80 font-semibold uppercase">{event.category}</span>
                      {" · "}{event.location}
                    </p>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>

          <ScrollReveal className="mt-auto pt-6">
            <Link to="/eventos" className="link-arrow">Ver agenda completa <span>&rarr;</span></Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.1),transparent_60%)]" />
        <div className="section-shell relative z-10 text-center">
          <ScrollReveal className="mx-auto max-w-2xl space-y-6">
            <span className="eyebrow">Junta-te à estrutura</span>
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Tens coragem para <span className="text-jsd-orange italic">aceitar o desafio</span>?
            </h2>
            <p className="copy mx-auto">Dá o primeiro passo e vem apoiar o núcleo juvenil mais ativo do concelho.</p>
            <Link to="/junta-te" className="btn-primary px-10 py-4 text-xs font-extrabold tracking-widest uppercase">
              Quero ser militante
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
