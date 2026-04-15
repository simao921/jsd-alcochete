import { Link } from "react-router-dom";

import { BrandLogo } from "../components/BrandLogo";
import { Card } from "../components/Card";
import { MainLayout } from "../layouts/MainLayout";

export function NotFoundPage() {
  return (
    <MainLayout>
      <section className="section-shell">
        <Card className="mx-auto max-w-4xl overflow-hidden border-jsd-orange/15 p-0">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex h-full flex-col justify-between bg-gradient-to-br from-jsd-orange to-[#c96b00] p-8 text-white md:p-10">
              <div className="space-y-6">
                <BrandLogo textTone="light" imageClassName="h-16 w-16 sm:h-20 sm:w-20" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Erro 404</p>
                  <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Página não encontrada</h1>
                </div>
              </div>
              <p className="mt-10 max-w-md text-sm leading-7 text-white/78">
                A rota pedida não existe ou está protegida. Se procuravas a área interna, o endereço público não revela o acesso.
              </p>
            </div>

            <div className="space-y-6 p-8 md:p-10">
              <p className="eyebrow">JSD Alcochete</p>
              <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Voltamos ao caminho certo</h2>
              <p className="copy">
                Continua a navegar pela plataforma institucional, consulta notícias, agenda e informação sobre a estrutura local.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/" className="btn-primary justify-center">
                  Ir para a home
                </Link>
                <Link to="/sobre" className="btn-secondary justify-center">
                  Ver Quem Somos?
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </MainLayout>
  );
}
