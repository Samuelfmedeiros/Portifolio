'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ChronoLogParallax - Motor visual de Parallax espacial com mapeamento de carreira
 * 3 camadas: Deep Space (L0), Telemetry/Hologramas (L1), Interface HUD (L2)
 */
export function ChronoLogParallax() {
  const targetRef = useRef<HTMLDivElement>(null);

  // Hook de captura do progresso do scroll (0.0 até 1.0)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  // L0: Move muito pouco (profundidade infinita)
  const layer0Y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  
  // L1: Move no sentido contrário para efeito holográfico
  const layer1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  // Interpolação de cores do fundo (a viagem no tempo)
  // De Ciano (ML) -> Azul (Infra) -> Verde Retro (Origem)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    ['rgba(6, 182, 212, 0.08)', 'rgba(79, 70, 229, 0.08)', 'rgba(34, 197, 94, 0.08)']
  );

  // Cor do glow dos cards
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    ['rgba(6, 182, 212, 0.4)', 'rgba(99, 102, 241, 0.4)', 'rgba(34, 197, 94, 0.4)']
  );

  // Cor do texto dos headings
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    ['rgb(34, 211, 238)', 'rgb(129, 140, 248)', 'rgb(74, 222, 128)']
  );

  return (
    <section ref={targetRef} className="relative h-[300vh] w-full bg-black overflow-hidden">
      
      {/* CAMADA L0: ESPAÇO PROFUNDO (Grid e Cores Animadas) */}
      <motion.div 
        style={{ y: layer0Y, backgroundColor }}
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:2rem_2rem]"
      />

      {/* CAMADA L1: HOLOGRAMAS / TELEMETRIA */}
      <motion.div 
        style={{ y: layer1Y }}
        className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between py-[20vh] items-center opacity-30"
      >
        {/* Círculos holográficos animados */}
        <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full border border-cyan-500/30 blur-[2px]" 
             style={{ animation: 'spin 60s linear infinite' }} />
        <div className="w-[300px] h-[300px] border border-indigo-500/30 blur-[1px] rotate-45" />
        <div className="w-[200px] h-[200px] rounded-full border border-green-500/30 blur-[3px]" />
        
        {/* Linhas de conexão */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.line 
            x1="10%" y1="20%" x2="90%" y2="40%"
            stroke="currentColor" strokeWidth="0.5"
            style={{ color: textColor }}
          />
          <motion.line 
            x1="80%" y1="30%" x2="20%" y2="70%"
            stroke="currentColor" strokeWidth="0.5"
            style={{ color: textColor }}
          />
        </svg>
      </motion.div>

      {/* CAMADA L2: DADOS FRONTAIS (HUD) */}
      <div className="relative z-20 flex flex-col justify-around h-full px-8 md:px-24 max-w-7xl mx-auto font-mono text-slate-200">
        
        {/* Bloco 2025: Dados & IA */}
        <motion.div 
          className="bg-slate-950/70 backdrop-blur-md border p-8 rounded-xl w-full max-w-2xl mt-[15vh] transition-all duration-500"
          style={{ 
            borderColor: glowColor,
            boxShadow: `0 0 30px ${glowColor.get()}`
          }}
        >
          <motion.h2 
            className="font-bold mb-2 tracking-widest text-sm"
            style={{ color: textColor }}
          >
            [ SYS.LOG: 2025_PRESENT ]
          </motion.h2>
          <h3 className="text-2xl text-white mb-4">Engenharia de Dados & Modelagem Preditiva</h3>
          <p className="text-slate-400 text-sm">
            Implementação de dashboards estratégicos em Power BI na ANA e otimização de arquiteturas de Machine Learning via TensorFlow/PyTorch.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Power BI', 'Python', 'Machine Learning', 'ETL', 'TensorFlow'].map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Bloco 2021-2025: Infraestrutura */}
        <motion.div 
          className="bg-slate-950/70 backdrop-blur-md border p-8 rounded-xl w-full max-w-2xl self-center transition-all duration-500"
          style={{ 
            borderColor: glowColor,
            boxShadow: `0 0 30px ${glowColor.get()}`
          }}
        >
          <motion.h2 
            className="font-bold mb-2 tracking-widest text-sm"
            style={{ color: textColor }}
          >
            [ SYS.LOG: 2021_2025 ]
          </motion.h2>
          <h3 className="text-2xl text-white mb-4">Gestão de Infraestrutura de TI</h3>
          <p className="text-slate-400 text-sm">
            Resolução de incidentes e suporte especializado na Global Hitss. Administração de redes, Microsoft Azure e suporte N1/N2.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Azure', 'Microsoft 365', 'Suporte N1', 'Redes', 'Windows Server'].map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-300">{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Bloco 2017-2020: Origem */}
        <motion.div 
          className="bg-slate-950/70 backdrop-blur-md border p-8 rounded-xl w-full max-w-2xl self-end mb-[15vh] transition-all duration-500"
          style={{ 
            borderColor: glowColor,
            boxShadow: `0 0 30px ${glowColor.get()}`
          }}
        >
          <motion.h2 
            className="font-bold mb-2 tracking-widest text-sm"
            style={{ color: textColor }}
          >
            [ SYS.LOG: 2017_2020 ]
          </motion.h2>
          <h3 className="text-2xl text-white mb-4">Fundamentos & Lógica Documental</h3>
          <p className="text-slate-400 text-sm">
            Atuação inicial no TRT 10. Estabelecimento de processos de digitalização, logística de armazenamento digital e controle de integridade da informação.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Gestão Documental', 'Logística', 'Trâmites Judiciais', 'Digitalização'].map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">{tag}</span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Indicador de progresso */}
      <motion.div 
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 w-1 h-32 bg-slate-800 rounded-full overflow-hidden"
        style={{ opacity: 0.6 }}
      >
        <motion.div 
          className="w-full bg-gradient-to-b from-cyan-400 via-indigo-400 to-green-400 rounded-full"
          style={{ 
            height: useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
          }}
        />
      </motion.div>

    </section>
  );
}
