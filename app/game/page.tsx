'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { GameEngine } from '@/game/core/GameEngine';
import { Player } from '@/game/entities/Player';
import { GAME_CONFIG } from '@/game/config/gameConfig';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const playerRef = useRef<Player | null>(null);
  const inputRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize game engine
    const canvas = canvasRef.current;
    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    // Initialize player
    const player = new Player(canvas.width / 2, canvas.height / 2);
    playerRef.current = player;

    // Setup input handling
    const keysPressed = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key.toLowerCase());

      // Pause with ESC
      if (e.key === 'Escape') {
        if (engine.isPaused()) {
          engine.resume();
          setIsPaused(false);
        } else {
          engine.pause();
          setIsPaused(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Update input vector
    const updateInput = () => {
      let x = 0;
      let y = 0;

      if (keysPressed.has('w') || keysPressed.has('arrowup')) y -= 1;
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) y += 1;
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) x -= 1;
      if (keysPressed.has('d') || keysPressed.has('arrowright')) x += 1;

      // Normalize diagonal movement
      if (x !== 0 && y !== 0) {
        const magnitude = Math.sqrt(x * x + y * y);
        x /= magnitude;
        y /= magnitude;
      }

      inputRef.current = { x, y };
    };

    // Game update loop
    engine.onUpdate((deltaTime) => {
      updateInput();
      player.update(deltaTime, inputRef.current);

      // Clamp player to canvas bounds
      const playerState = player.getState();
      const halfWidth = playerState.width / 2;
      const halfHeight = playerState.height / 2;

      if (playerState.x < halfWidth) playerState.x = halfWidth;
      if (playerState.x > canvas.width - halfWidth) playerState.x = canvas.width - halfWidth;
      if (playerState.y < halfHeight) playerState.y = halfHeight;
      if (playerState.y > canvas.height - halfHeight) playerState.y = canvas.height - halfHeight;
    });

    // Game render loop
    engine.onRender((ctx) => {
      // Draw background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Render player
      player.render(ctx);

      // Draw HUD
      ctx.save();
      ctx.fillStyle = '#06b6d4';
      ctx.font = '20px monospace';
      ctx.fillText(`FPS: ${Math.round(1 / engine.getElapsedTime() || 0)}`, 20, 30);

      const playerState = player.getState();
      ctx.fillText(`Level: ${playerState.level}`, 20, 60);
      ctx.fillText(`XP: ${playerState.xp}/${playerState.xpToNextLevel}`, 20, 90);
      ctx.fillText(`HP: ${playerState.health}/${playerState.maxHealth}`, 20, 120);
      ctx.restore();
    });

    // Start the game
    engine.start();
    setIsLoaded(true);

    return () => {
      engine.stop();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.canvas.width}
        height={GAME_CONFIG.canvas.height}
        className="border-2 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] max-w-full h-auto"
      />

      {/* Pause Menu */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 p-8 rounded-lg border-2 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.8)]">
            <h2 className="text-4xl font-bold text-cyan-400 mb-8 text-center font-mono">
              &gt; PAUSADO
            </h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  engineRef.current?.resume();
                  setIsPaused(false);
                }}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded font-mono transition-all"
              >
                &gt; CONTINUAR
              </button>
              <Link href="/">
                <button className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded font-mono transition-all">
                  &gt; MENU PRINCIPAL
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-cyan-400 text-2xl font-mono animate-pulse">
            &gt; CARREGANDO...
          </div>
        </div>
      )}

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-sm">
        <p>&gt; WASD / Setas: Mover</p>
        <p>&gt; ESC: Pausar</p>
      </div>
    </div>
  );
}
