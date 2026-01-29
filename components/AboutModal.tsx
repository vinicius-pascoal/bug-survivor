'use client';

import { useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-2 border-cyan-500 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glitch Effect Header */}
        <div className="sticky top-0 bg-gray-900 border-b-2 border-cyan-500/50 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-emerald-400 font-mono">
              &gt; SOBRE_
            </h2>
            <button
              onClick={onClose}
              className="text-cyan-400 hover:text-cyan-300 hover:rotate-90 transition-all duration-300 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-300 font-mono">
          {/* Description */}
          <section>
            <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span> O JOGO
            </h3>
            <p className="leading-relaxed text-gray-300">
              <span className="text-cyan-300">Bug Survivor</span> é um jogo <span className="text-purple-400">survivors-like</span> ambientado em um mundo cyberpunk.
              Enfrente ondas infinitas de bugs digitais e vírus em uma batalha frenética pela sobrevivência no ciberespaço.
            </p>
            <p className="mt-2 leading-relaxed text-gray-300">
              Colete XP, evolua suas armas, e torne-se cada vez mais poderoso enquanto o caos digital tenta te consumir!
            </p>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span> CARACTERÍSTICAS
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">▸</span>
                <span>Sistema de progressão com coleta de XP e level-up</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">▸</span>
                <span>Múltiplas armas e upgrades estratégicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">▸</span>
                <span>Ondas infinitas com dificuldade crescente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">▸</span>
                <span>Sistema de combate frenético e desafiador</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">▸</span>
                <span>Estética cyberpunk com visual retrô-futurista</span>
              </li>
            </ul>
          </section>

          {/* Tech Stack */}
          <section>
            <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span> TECNOLOGIAS
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 border border-cyan-500/30 rounded p-3 hover:border-cyan-500 transition-colors">
                <p className="text-cyan-300 font-bold">Next.js 16</p>
                <p className="text-xs text-gray-400">Framework React</p>
              </div>
              <div className="bg-gray-800 border border-purple-500/30 rounded p-3 hover:border-purple-500 transition-colors">
                <p className="text-purple-300 font-bold">TypeScript</p>
                <p className="text-xs text-gray-400">Type Safety</p>
              </div>
              <div className="bg-gray-800 border border-emerald-500/30 rounded p-3 hover:border-emerald-500 transition-colors">
                <p className="text-emerald-300 font-bold">Tailwind CSS</p>
                <p className="text-xs text-gray-400">Styling</p>
              </div>
              <div className="bg-gray-800 border border-magenta-500/30 rounded p-3 hover:border-magenta-500 transition-colors">
                <p className="text-magenta-300 font-bold">Canvas API</p>
                <p className="text-xs text-gray-400">Renderização</p>
              </div>
            </div>
          </section>

          {/* Credits */}
          <section>
            <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span> CRÉDITOS
            </h3>
            <div className="bg-gray-800 border border-cyan-500/30 rounded p-4">
              <p className="text-gray-300">
                <span className="text-cyan-300 font-bold">Desenvolvido por:</span> Vinicius Pascoal
              </p>
              <p className="text-gray-300 mt-2">
                <span className="text-cyan-300 font-bold">Conceito:</span> Jogo survivors-like cyberpunk
              </p>
              <p className="text-gray-300 mt-2">
                <span className="text-cyan-300 font-bold">Versão:</span> 1.0.0 (Alpha)
              </p>
              <p className="text-gray-300 mt-2">
                <span className="text-cyan-300 font-bold">Fontes das imagens:</span> pixellab, craftpix, Gemini
              </p>
            </div>
          </section>

          {/* Footer */}
          <section className="text-center pt-4 border-t border-cyan-500/30">
            <p className="text-sm text-gray-400">
              Pressione <span className="text-cyan-400 font-bold">ESC</span> ou clique fora para fechar
            </p>
          </section>
        </div>

        {/* Animated scanline effect */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="h-full w-full animate-scan" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.2) 2px, rgba(0, 255, 255, 0.2) 4px)'
          }} />
        </div>
      </div>
    </div>
  );
}
