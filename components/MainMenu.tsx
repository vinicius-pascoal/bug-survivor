'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function MainMenu() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/fundos home/origbig.png')",
          filter: 'brightness(0.7)',
        }}
      />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Glitch Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo/Title */}
        <div className="mb-16 text-center flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/tvheadman/a_tv_head_man_using_a_moleton_rotations_8dir.gif"
              alt="TV Head Man"
              width={80}
              height={80}
              className="object-contain"
              unoptimized
              style={{ imageRendering: 'pixelated' }}
            />
            <h1 className="text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-magenta-500 animate-pulse drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
              BUG SURVIVOR
            </h1>
          </div>
          <p className="text-lg tracking-widest text-cyan-300 font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            &gt; SURVIVE THE DIGITAL CHAOS_
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-5 w-full max-w-md">
          <Link href="/game">
            <button
              onMouseEnter={() => setHoveredButton('play')}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-full relative group overflow-hidden"
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-lg opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />

              {/* Button content */}
              <div className={`
                relative px-8 py-5 text-xl font-bold tracking-wider
                bg-gradient-to-r from-purple-600/90 to-cyan-600/90
                backdrop-blur-sm
                text-white rounded-lg
                transform transition-all duration-300 ease-out
                ${hoveredButton === 'play' ? 'scale-[1.02] translate-y-[-2px]' : ''}
                border border-cyan-400/50
                font-mono
                shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
              `}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-cyan-300">&gt;</span>
                  <span className="tracking-widest">INICIAR JOGO</span>
                  {hoveredButton === 'play' && <span className="animate-pulse">_</span>}
                </span>
              </div>

              {/* Animated scanline effect on hover */}
              {hoveredButton === 'play' && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent rounded-lg animate-scan pointer-events-none" />
              )}
            </button>
          </Link>

          <button
            onMouseEnter={() => setHoveredButton('upgrades')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-full relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-magenta-500 via-purple-400 to-magenta-500 rounded-lg opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />

            <div className={`
              relative px-8 py-5 text-xl font-bold tracking-wider
              bg-gradient-to-r from-magenta-600/90 to-purple-600/90
              backdrop-blur-sm
              text-white rounded-lg
              transform transition-all duration-300 ease-out
              ${hoveredButton === 'upgrades' ? 'scale-[1.02] translate-y-[-2px]' : ''}
              border border-magenta-400/50
              font-mono
              shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
            `}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-magenta-300">&gt;</span>
                <span className="tracking-widest">UPGRADES</span>
                {hoveredButton === 'upgrades' && <span className="animate-pulse">_</span>}
              </span>
            </div>

            {hoveredButton === 'upgrades' && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent rounded-lg animate-scan pointer-events-none" />
            )}
          </button>

          <button
            onMouseEnter={() => setHoveredButton('options')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-full relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 rounded-lg opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />

            <div className={`
              relative px-8 py-5 text-xl font-bold tracking-wider
              bg-gradient-to-r from-cyan-600/90 to-blue-600/90
              backdrop-blur-sm
              text-white rounded-lg
              transform transition-all duration-300 ease-out
              ${hoveredButton === 'options' ? 'scale-[1.02] translate-y-[-2px]' : ''}
              border border-cyan-400/50
              font-mono
              shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
            `}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-cyan-300">&gt;</span>
                <span className="tracking-widest">OPÇÕES</span>
                {hoveredButton === 'options' && <span className="animate-pulse">_</span>}
              </span>
            </div>

            {hoveredButton === 'options' && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent rounded-lg animate-scan pointer-events-none" />
            )}
          </button>

          <button
            onMouseEnter={() => setHoveredButton('about')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-full relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 rounded-lg opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />

            <div className={`
              relative px-8 py-5 text-xl font-bold tracking-wider
              bg-gradient-to-r from-emerald-600/90 to-green-600/90
              backdrop-blur-sm
              text-white rounded-lg
              transform transition-all duration-300 ease-out
              ${hoveredButton === 'about' ? 'scale-[1.02] translate-y-[-2px]' : ''}
              border border-emerald-400/50
              font-mono
              shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
            `}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-emerald-300">&gt;</span>
                <span className="tracking-widest">SOBRE</span>
                {hoveredButton === 'about' && <span className="animate-pulse">_</span>}
              </span>
            </div>

            {hoveredButton === 'about' && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent rounded-lg animate-scan pointer-events-none" />
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-cyan-300 font-mono opacity-70">
            v0.1.0 | Desenvolvido por Vinicius Pascoal
          </p>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="h-full w-full animate-scan" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.2) 2px, rgba(0, 255, 255, 0.2) 4px)'
        }} />
      </div>
    </div>
  );
}
