import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative w-full bg-jsd-orange flex flex-col items-center">
      {/* Utiliza a imagem anexada, guardada na pasta public como 'banner.jpg' ou 'banner.png' */}
      <img
        src="/banner.jpg"
        alt="Somos a História do Futuro - JSD"
        className="w-full h-auto max-h-[70vh] object-cover object-top shadow-xl"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/banner.png"; // Fallback para .png se o utilizador gravou assim
        }}
      />
      <div className="section-shell py-12 flex flex-col items-center text-center space-y-6">
        <h1 className="font-display text-4xl mt-4 font-black text-white md:text-5xl max-w-3xl leading-tight">
          A tua voz conta. Junta-te à geração que faz acontecer.
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium">
          Não deixes que decidam por ti. Aqui tens o espaço e a estrutura para construíres o futuro de Alcochete.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link to="/junta-te" className="btn-secondary !bg-white !text-jsd-orange !border-white hover:!bg-[#fff8ef] text-lg px-8 py-4">
            Quero dar o salto
          </Link>
          <Link to="/sobre" className="btn-primary !border-white/20 !text-white hover:!bg-white/10 text-lg px-8 py-4">
            Descobre quem somos
          </Link>
        </div>
      </div>
    </section>
  );
}
