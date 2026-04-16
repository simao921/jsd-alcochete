import { Link } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { formatDate } from "../services/helpers";

function getDay(isoString) {
  return new Date(isoString).toLocaleDateString("pt-PT", { day: "2-digit" });
}

function getMonth(isoString) {
  return new Date(isoString).toLocaleDateString("pt-PT", { month: "short" }).replace(".", "");
}

export function HomePage() {
  const { news, events, stats } = useApp();

  useDocumentMeta({
    title: "JSD Alcochete | Coragem para Mudar",
    description: "Site oficial da JSD Alcochete. Fica a par das nossas atividades e vem fazer parte da estrutura.",
    keywords: "JSD Alcochete, juventude social democrata, militantes, política local"
  });

  return (
    <>
      <HeroSection />

      {/* Secção Híbrida Lado-a-Lado */}
      <section className="section-shell mt-16 md:mt-24 mb-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Lado Esquerdo: Últimas Notícias */}
        <div className="flex flex-col h-full bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-jsd-orange/15 shadow-sm">
          <ScrollReveal className="border-b border-jsd-orange/20 pb-6 mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-black text-jsd-blue-dark">O que se passa</h2>
            <p className="mt-4 text-jsd-black/60 text-lg">
              Acompanha as nossas posições públicas, o trabalho no terreno e as iniciativas diárias.
            </p>
          </ScrollReveal>
          
          {news.length === 0 ? (
            <div className="py-8 border-b border-black/5">
              <p className="text-jsd-black/50 text-lg">Sem publicações recentes. Fica atento às próximas novidades!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 flex-1">
              {news.slice(0, 3).map((article) => (
                <ScrollReveal key={article.id} className="group border-b border-black/5 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-bold text-jsd-orange tracking-widest uppercase">
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="inline-block border border-jsd-orange/30 text-jsd-orange px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                  <Link to={`/noticias/${article.id}`}>
                    <h3 className="text-2xl font-display font-black text-jsd-black group-hover:text-jsd-orange transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="mt-3 text-jsd-black/75 leading-relaxed text-base md:text-lg line-clamp-3">
                    {article.excerpt}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          )}
          
          <ScrollReveal className="mt-8 pt-4">
            <Link to="/noticias" className="inline-flex font-bold text-jsd-orange hover:text-jsd-blue-dark transition-colors uppercase tracking-widest">
              Ver todas as mensagens &rarr;
            </Link>
          </ScrollReveal>
        </div>

        {/* Lado Direito: Agenda/Apelo */}
        <div className="flex flex-col h-full bg-[#f0ece5] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
          <ScrollReveal className="space-y-6 mb-10">
             <p className="eyebrow !text-jsd-orange/70">Aparece na sede</p>
             <h2 className="font-display text-4xl md:text-5xl font-black text-jsd-blue-dark leading-tight">Vem debater connosco.</h2>
             <p className="text-jsd-black/70 text-lg leading-relaxed">
                As nossas portas estão abertas a todos os jovens. A política não se faz apenas nas redes sociais, faz-se nas ruas, nos cafés e nas reuniões onde decidimos as respostas aos verdadeiros problemas de Alcochete.
             </p>
             <div className="pt-2">
               <Link to="/eventos" className="btn-primary">A Nossa Agenda</Link>
             </div>
          </ScrollReveal>
          
          <div className="flex flex-col space-y-4">
            {events.length === 0 ? (
               <div className="bg-white rounded-[1.5rem] p-6 text-center shadow-sm">
                 <p className="text-jsd-black/50 font-medium">Agenda em preparação. Fica atento!</p>
               </div>
            ) : (
              events.slice(0, 3).map((event) => (
                <ScrollReveal key={event.id} className="bg-white rounded-[1.5rem] p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center justify-center min-w-[65px] bg-[#f0ece5] rounded-xl p-3">
                    <span className="text-jsd-orange font-black text-2xl leading-none">{getDay(event.date)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-jsd-black/60 mt-1">{getMonth(event.date)}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-display text-xl font-bold text-jsd-blue-dark leading-tight line-clamp-2">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-jsd-black/50 whitespace-nowrap overflow-hidden">
                       <span className="uppercase tracking-wider flex-shrink-0">{event.category}</span>
                       <span className="flex-shrink-0">•</span>
                       <span className="truncate">📍 {event.location}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to action em bloco isolado brutalista */}
      <section className="bg-jsd-blue-dark text-white py-24 md:py-32">
         <div className="section-shell text-center flex flex-col items-center">
            <ScrollReveal>
               <h2 className="font-display text-5xl md:text-7xl font-black mb-6 leading-tight max-w-4xl mx-auto">
                 Coragem para aceitar o desafio?
               </h2>
               <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">
                 Dá o primeiro passo e vem juntar-te ao núcleo jovem mais ativo do concelho.
               </p>
               <Link to="/junta-te" className="btn-primary inline-flex !bg-jsd-orange !border-jsd-orange !text-white text-lg md:text-xl px-12 py-5 rounded-full shadow-[0_8px_30px_rgb(255,153,0,0.3)] hover:!bg-white hover:!text-jsd-orange hover:shadow-none hover:scale-105 transition-all">
                 QUERO SER MILITANTE
               </Link>
            </ScrollReveal>
         </div>
      </section>
    </>
  );
}
