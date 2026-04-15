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

      {/* Secção de Notícias - Sem cards genéricos */}
      <section className="section-shell mt-16 md:mt-24">
        <ScrollReveal className="border-b border-jsd-orange/20 pb-6 mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-black text-jsd-blue-dark">O que se passa</h2>
          <p className="mt-4 text-jsd-black/60 text-lg max-w-2xl">
            Acompanha as nossas posições públicas, o trabalho no terreno e as iniciativas que marcam o ritmo do partido no concelho.
          </p>
        </ScrollReveal>
        
        <div className="flex flex-col gap-10">
          {news.slice(0, 3).map((article) => (
            <ScrollReveal key={article.id} className="group grid gap-4 md:grid-cols-[200px_1fr] items-start border-b border-black/5 pb-10 last:border-0 last:pb-0">
              <span className="text-sm font-bold text-jsd-orange tracking-widest uppercase mt-1">
                {formatDate(article.publishedAt)}
              </span>
              <div>
                <Link to={`/noticias/${article.id}`}>
                  <h3 className="text-3xl font-display font-black text-jsd-black group-hover:text-jsd-orange transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="mt-4 text-jsd-black/75 leading-relaxed max-w-3xl text-lg">
                  {article.excerpt}
                </p>
                <div className="mt-6">
                  <span className="inline-block border border-jsd-orange/30 text-jsd-orange px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        <ScrollReveal className="mt-12 text-center md:text-left">
          <Link to="/noticias" className="inline-flex font-bold text-jsd-orange hover:text-jsd-blue-dark transition-colors uppercase tracking-widest">
            Ver todas as mensagens &rarr;
          </Link>
        </ScrollReveal>
      </section>

      {/* Secção de Agenda - Formato Lista Limpa sem bordas grossas */}
      <section className="section-shell mt-16 md:mt-32 mb-16">
        <div className="bg-[#f0ece5] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-center">
          <ScrollReveal className="space-y-6">
             <p className="eyebrow !text-jsd-orange/70">Aparece na sede</p>
             <h2 className="font-display text-5xl md:text-6xl font-black text-jsd-blue-dark leading-tight">Vem debater connosco.</h2>
             <p className="text-jsd-black/70 text-lg leading-relaxed">
                As nossas portas estão abertas a todos os jovens. A política não se faz apenas nas redes sociais, faz-se nas ruas, nos cafés e nas reuniões onde decidimos as respostas aos verdadeiros problemas de Alcochete.
             </p>
             <div className="pt-4">
               <Link to="/eventos" className="btn-primary">A NOSSA AGENDA</Link>
             </div>
          </ScrollReveal>
          
           <div className="flex flex-col space-y-4">
            {events.slice(0, 3).map((event) => (
              <ScrollReveal key={event.id} className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                  <div className="flex flex-row md:flex-col items-center md:items-start text-left md:min-w-[70px]">
                    <span className="text-jsd-orange font-black text-4xl md:text-5xl">{getDay(event.date)}</span>
                    <span className="text-sm font-bold uppercase tracking-widest text-jsd-black/60 md:-mt-1 ml-2 md:ml-0">{getMonth(event.date)}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-jsd-blue-dark">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm font-semibold text-jsd-black/50">
                       <span className="uppercase tracking-wider">{event.category}</span>
                       <span>•</span>
                       <span>📍 {event.location}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
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
