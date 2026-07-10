import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { CinematicBanner } from "./CinematicBanner";

export function HeroSection() {
  return (
    <CinematicBanner
      label="JSD Alcochete"
      titleLines={[
        { text: "A tua voz conta.", highlight: false },
        { text: "Junta-te à geração", highlight: false },
        { text: "que faz acontecer.", highlight: true }
      ]}
      description="Não deixes que outros decidam o futuro de Alcochete por ti. Espaço, ideias e equipa para moldares o rumo do nosso concelho."
      image="/banner.jpg"
      fallbackImage="/banner.png"
      scrollTargetId="home-content"
    >
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/junta-te" className="btn-primary px-8 py-3.5 text-xs font-extrabold tracking-widest uppercase">
            Quero dar o salto
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/sobre" className="btn-secondary px-8 py-3.5 text-xs font-extrabold tracking-widest uppercase">
            Descobre quem somos
          </Link>
        </motion.div>
      </div>
    </CinematicBanner>
  );
}
