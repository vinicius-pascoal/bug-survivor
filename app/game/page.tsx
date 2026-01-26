'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { GameEngine } from '@/game/core/GameEngine';
import { Player } from '@/game/entities/Player';
import { EnemySpawner } from '@/game/systems/EnemySpawner';
import { XPDropSystem } from '@/game/systems/XPDropSystem';
import { ChestSpawner } from '@/game/systems/ChestSpawner';
import { DataDiskWeapon } from '@/game/weapons/DataDiskWeapon';
import { GAME_CONFIG } from '@/game/config/gameConfig';
import { formatTime } from '@/utils/helpers';
import { WeaponData } from '@/game/types/WeaponTypes';
import { WeaponSlot } from '@/game/systems/WeaponInventory';
import { WeaponAcquiredModal } from '@/components/WeaponAcquiredModal';
import { WeaponReplaceModal } from '@/components/WeaponReplaceModal';
import { WeaponInventoryUI } from '@/components/WeaponInventoryUI';
import { UpgradeSelectionModal } from '@/components/UpgradeSelectionModal';
import { StarterWeaponModal } from '@/components/StarterWeaponModal';
import { Chest } from '@/game/entities/Chest';
import { UpgradeSystem } from '@/game/upgrades/UpgradeSystem';
import { Upgrade, UpgradeType, StatUpgrade, WeaponUpgrade, StatType } from '@/game/types/UpgradeTypes';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const playerRef = useRef<Player | null>(null);
  const enemySpawnerRef = useRef<EnemySpawner | null>(null);
  const xpDropSystemRef = useRef<XPDropSystem | null>(null);
  const chestSpawnerRef = useRef<ChestSpawner | null>(null);
  const weaponRef = useRef<DataDiskWeapon | null>(null);
  const inputRef = useRef({ x: 0, y: 0 });
  const damageTimerRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [killCount, setKillCount] = useState(0);

  // Estados para sistema de armas
  const [pendingWeapon, setPendingWeapon] = useState<WeaponData | null>(null);
  const [showWeaponAcquired, setShowWeaponAcquired] = useState(false);
  const [showWeaponReplace, setShowWeaponReplace] = useState(false);
  const [weaponSlots, setWeaponSlots] = useState<WeaponSlot[]>([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const nearbyChestRef = useRef<Chest | null>(null);
  
  // Estados para sistema de upgrades
  const [showStarterWeaponSelection, setShowStarterWeaponSelection] = useState(true);
  const [showUpgradeSelection, setShowUpgradeSelection] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState<Upgrade[]>([]);
  const upgradeSystemRef = useRef<UpgradeSystem>(new UpgradeSystem());

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    const chestSpawner = new ChestSpawner();
    chestSpawnerRef.current = chestSpawner;

    const player = new Player(canvas.width / 2, canvas.height / 2);
    playerRef.current = player;

    const enemySpawner = new EnemySpawner(canvas.width, canvas.height, GAME_CONFIG.enemies.spawnRate);
    enemySpawnerRef.current = enemySpawner;

    const xpDropSystem = new XPDropSystem();
    xpDropSystemRef.current = xpDropSystem;

    const weapon = new DataDiskWeapon(
      GAME_CONFIG.weapons.dataDisk.count,
      GAME_CONFIG.weapons.dataDisk.radius,
      GAME_CONFIG.weapons.dataDisk.damage,
      GAME_CONFIG.weapons.dataDisk.speed
    );
    weaponRef.current = weapon;

    const keysPressed = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key.toLowerCase());
      if (e.key === 'Escape') {
        if (engine.isPaused()) {
          engine.resume();
          setIsPaused(false);
        } else {
          engine.pause();
          setIsPaused(true);
        }
      }
      // Tecla E para abrir baú
      if (e.key.toLowerCase() === 'e') {
        if (nearbyChestRef.current && playerRef.current) {
          const weaponData = nearbyChestRef.current.open();
          setPendingWeapon(weaponData);

          if (playerRef.current.hasWeaponSpace()) {
            setShowWeaponAcquired(true);
          } else {
            setShowWeaponReplace(true);
          }

          engine.pause();
          nearbyChestRef.current = null;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const updateInput = () => {
      let x = 0;
      let y = 0;
      if (keysPressed.has('w') || keysPressed.has('arrowup')) y -= 1;
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) y += 1;
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) x -= 1;
      if (keysPressed.has('d') || keysPressed.has('arrowright')) x += 1;
      if (x !== 0 && y !== 0) {
        const magnitude = Math.sqrt(x * x + y * y);
        x /= magnitude;
        y /= magnitude;
      }
      inputRef.current = { x, y };
    };

    engine.onUpdate((deltaTime) => {
      updateInput();
      const playerState = player.getState();
      const playerPos = player.getPosition();

      // Get enemies before player update
      const enemies = enemySpawner.getEnemies();

      // Update player with enemies for combat system
      player.update(deltaTime, inputRef.current, enemies);

      const halfWidth = playerState.width / 2;
      const halfHeight = playerState.height / 2;
      if (playerState.x < halfWidth) playerState.x = halfWidth;
      if (playerState.x > canvas.width - halfWidth) playerState.x = canvas.width - halfWidth;
      if (playerState.y < halfHeight) playerState.y = halfHeight;
      if (playerState.y > canvas.height - halfHeight) playerState.y = canvas.height - halfHeight;

      // Atualiza chest spawner
      chestSpawner.update(deltaTime, playerState.level, playerPos.x, playerPos.y);

      // Verifica colisão com baús
      const nearbyChest = chestSpawner.checkCollisions(playerPos.x, playerPos.y, playerState.width / 2);
      nearbyChestRef.current = nearbyChest;

      weapon.update(deltaTime, playerPos.x, playerPos.y);
      enemySpawner.update(deltaTime, engine.getElapsedTime());

      enemies.forEach(enemy => enemy.update(deltaTime, playerPos.x, playerPos.y));

      // Check for dead enemies from weapon combat system and create XP drops
      let weaponKills = 0;
      enemies.forEach(enemy => {
        const enemyState = enemy.getState();
        if (!enemyState.active && enemyState.health <= 0) {
          // Enemy just died, create XP drop
          xpDropSystem.createDrop(enemyState.id, enemyState.x, enemyState.y, enemyState.xpValue);
          weaponKills++;
        }
      });

      const projectiles = weapon.getProjectiles();
      let kills = weaponKills;
      projectiles.forEach(projectile => {
        const projState = projectile.getState();
        if (!projState.active) return;
        enemies.forEach(enemy => {
          const enemyState = enemy.getState();
          if (!enemyState.active) return;
          const distance = Math.sqrt(
            Math.pow(projState.x - enemyState.x, 2) +
            Math.pow(projState.y - enemyState.y, 2)
          );
          if (distance < projState.radius + enemyState.width / 2) {
            const died = enemy.takeDamage(projState.damage);
            if (died) {
              xpDropSystem.createDrop(enemyState.id, enemyState.x, enemyState.y, enemyState.xpValue);
              kills++;
            }
          }
        });
      });

      if (kills > 0) setKillCount(prev => prev + kills);

      const collectedXP = xpDropSystem.update(deltaTime, playerPos.x, playerPos.y);
      if (collectedXP > 0) {
        const leveledUp = player.gainXP(collectedXP);
        if (leveledUp) {
          const newLevel = playerState.level;
          setPlayerLevel(newLevel);
          setWeaponSlots(player.getWeaponInventory().getSlots());
          
          // Gerar opções de upgrade
          upgradeSystemRef.current.setPlayerLevel(newLevel);
          const hasSpace = player.hasWeaponSpace();
          const options = upgradeSystemRef.current.generateUpgradeOptions(3, hasSpace);
          setUpgradeOptions(options);
          setShowUpgradeSelection(true);
          
          engine.pause();
        }
      }

      damageTimerRef.current += deltaTime;
      if (damageTimerRef.current >= 0.5) {
        enemies.forEach(enemy => {
          const enemyState = enemy.getState();
          if (!enemyState.active) return;
          const distance = Math.sqrt(
            Math.pow(enemyState.x - playerPos.x, 2) +
            Math.pow(enemyState.y - playerPos.y, 2)
          );
          if (distance < (enemyState.width / 2 + playerState.width / 2)) {
            const died = player.takeDamage(enemyState.damage);
            if (died) {
              engine.stop();
              setIsGameOver(true);
              setSurvivalTime(engine.getElapsedTime());
            }
            damageTimerRef.current = 0;
          }
        });
      }
    });

    engine.onRender((ctx) => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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

      player.render(ctx);
      weapon.render(ctx);
      chestSpawner.render(ctx);
      enemySpawner.getEnemies().forEach(enemy => enemy.render(ctx));
      xpDropSystem.render(ctx);

      // Desenha indicador de baú próximo
      if (nearbyChestRef.current) {
        const chestPos = nearbyChestRef.current.getPosition();
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Pressione E para abrir', chestPos.x, chestPos.y - 40);
        ctx.restore();
      }

      ctx.save();
      ctx.fillStyle = '#06b6d4';
      ctx.font = '20px monospace';
      const playerState = player.getState();
      const gameTime = engine.getElapsedTime();
      ctx.fillText(`Time: ${formatTime(gameTime)}`, 20, 30);
      ctx.fillText(`Level: ${playerState.level}`, 20, 60);
      ctx.fillText(`Kills: ${killCount}`, 20, 90);

      const xpPercent = playerState.xp / playerState.xpToNextLevel;
      const barWidth = 200;
      const barHeight = 20;
      const barX = 20;
      const barY = 100;
      ctx.fillStyle = '#333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(barX, barY, barWidth * xpPercent, barHeight);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`XP: ${playerState.xp}/${playerState.xpToNextLevel}`, barX + 5, barY + 15);

      const healthPercent = playerState.health / playerState.maxHealth;
      const healthBarY = barY + 30;
      ctx.fillStyle = '#333';
      ctx.fillRect(barX, healthBarY, barWidth, barHeight);
      ctx.fillStyle = healthPercent > 0.5 ? '#10b981' : healthPercent > 0.25 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(barX, healthBarY, barWidth * healthPercent, barHeight);
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(barX, healthBarY, barWidth, barHeight);
      ctx.fillStyle = '#fff';
      ctx.fillText(`HP: ${Math.ceil(playerState.health)}/${playerState.maxHealth}`, barX + 5, healthBarY + 15);
      ctx.restore();
    });

    engine.start();
    
    // Pausa o jogo no início para seleção de arma
    engine.pause();
    setIsLoaded(true);

    // Inicializa estados de UI
    setPlayerLevel(player.getState().level);
    setWeaponSlots(player.getWeaponInventory().getSlots());

    return () => {
      engine.stop();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Funções para lidar com aquisição de armas
  const handleWeaponAcquired = () => {
    if (pendingWeapon && playerRef.current) {
      const result = playerRef.current.addWeapon(pendingWeapon);
      if (result.success) {
        setWeaponSlots(playerRef.current.getWeaponInventory().getSlots());
      }
      setPendingWeapon(null);
      setShowWeaponAcquired(false);
      engineRef.current?.resume();
    }
  };

  const handleWeaponReplace = (slotIndex: number) => {
    if (pendingWeapon && playerRef.current) {
      const result = playerRef.current.replaceWeapon(slotIndex, pendingWeapon);
      if (result.success) {
        setWeaponSlots(playerRef.current.getWeaponInventory().getSlots());
      }
      setPendingWeapon(null);
      setShowWeaponReplace(false);
      engineRef.current?.resume();
    }
  };

  const handleWeaponDiscard = () => {
    setPendingWeapon(null);
    setShowWeaponReplace(false);
    engineRef.current?.resume();
  };

  // Funções para sistema de upgrades
  const handleStarterWeaponSelect = (weaponUpgrade: WeaponUpgrade) => {
    if (playerRef.current) {
      playerRef.current.addWeapon(weaponUpgrade.weaponData);
      setWeaponSlots(playerRef.current.getWeaponInventory().getSlots());
      setShowStarterWeaponSelection(false);
      engineRef.current?.resume();
    }
  };

  const handleUpgradeSelect = (upgrade: Upgrade) => {
    if (!playerRef.current) return;

    if (upgrade.type === UpgradeType.WEAPON) {
      const weaponUpgrade = upgrade as WeaponUpgrade;
      if (playerRef.current.hasWeaponSpace()) {
        playerRef.current.addWeapon(weaponUpgrade.weaponData);
        setWeaponSlots(playerRef.current.getWeaponInventory().getSlots());
      }
    } else if (upgrade.type === UpgradeType.STAT) {
      const statUpgrade = upgrade as StatUpgrade;
      
      switch (statUpgrade.statType) {
        case StatType.MAX_HEALTH:
          playerRef.current.increaseMaxHealth(statUpgrade.value);
          break;
        case StatType.SPEED:
          playerRef.current.increaseSpeed(statUpgrade.value);
          break;
        case StatType.DAMAGE:
          playerRef.current.increaseDamage(statUpgrade.value);
          break;
        case StatType.ATTACK_SPEED:
          playerRef.current.increaseAttackSpeed(statUpgrade.value);
          break;
        case StatType.CRIT_CHANCE:
          playerRef.current.increaseCritChance(statUpgrade.value);
          break;
        case StatType.AREA_OF_EFFECT:
          playerRef.current.increaseAreaOfEffect(statUpgrade.value);
          break;
      }
    }

    setShowUpgradeSelection(false);
    engineRef.current?.resume();
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.canvas.width}
        height={GAME_CONFIG.canvas.height}
        className="border-2 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] max-w-full h-auto"
      />
      {isPaused && !showUpgradeSelection && !showStarterWeaponSelection && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-linear-to-br from-purple-900/50 to-cyan-900/50 p-8 rounded-lg border-2 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.8)]">
            <h2 className="text-4xl font-bold text-cyan-400 mb-8 text-center font-mono">&gt; PAUSADO</h2>
            <div className="flex flex-col gap-4">
              <button onClick={() => { engineRef.current?.resume(); setIsPaused(false); }} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded font-mono transition-all">&gt; CONTINUAR</button>
              <Link href="/"><button className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded font-mono transition-all">&gt; MENU PRINCIPAL</button></Link>
            </div>
          </div>
        </div>
      )}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-linear-to-br from-red-900/80 to-purple-900/80 p-12 rounded-lg border-2 border-red-400 shadow-[0_0_60px_rgba(239,68,68,0.8)] max-w-md">
            <h2 className="text-6xl font-bold text-red-400 mb-8 text-center font-mono">GAME OVER</h2>
            <div className="text-cyan-300 font-mono space-y-3 mb-8 text-center">
              <p className="text-2xl">&gt; Tempo: {formatTime(survivalTime)}</p>
              <p className="text-2xl">&gt; Level: {playerRef.current?.getState().level || 1}</p>
              <p className="text-2xl">&gt; Kills: {killCount}</p>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded font-mono transition-all">&gt; JOGAR NOVAMENTE</button>
              <Link href="/"><button className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded font-mono transition-all">&gt; MENU PRINCIPAL</button></Link>
            </div>
          </div>
        </div>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-cyan-400 text-2xl font-mono animate-pulse">&gt; CARREGANDO...</div>
        </div>
      )}

      {/* UI de inventário de armas */}
      {isLoaded && !isGameOver && <WeaponInventoryUI slots={weaponSlots} playerLevel={playerLevel} />}

      {/* Modal de arma adquirida */}
      {showWeaponAcquired && pendingWeapon && (
        <WeaponAcquiredModal
          weapon={pendingWeapon}
          onConfirm={handleWeaponAcquired}
        />
      )}

      {/* Modal de substituição de arma */}
      {showWeaponReplace && pendingWeapon && playerRef.current && (
        <WeaponReplaceModal
          newWeapon={pendingWeapon}
          currentSlots={playerRef.current.getWeaponInventory().getSlots()}
          onReplace={handleWeaponReplace}
          onDiscard={handleWeaponDiscard}
        />
      )}

      {/* Modal de seleção de arma inicial */}
      {showStarterWeaponSelection && (
        <StarterWeaponModal
          weapons={upgradeSystemRef.current.generateStarterWeaponOptions()}
          onSelectWeapon={handleStarterWeaponSelect}
        />
      )}

      {/* Modal de seleção de upgrade ao subir de nível */}
      {showUpgradeSelection && (
        <UpgradeSelectionModal
          upgrades={upgradeOptions}
          onSelectUpgrade={handleUpgradeSelect}
          playerLevel={playerLevel}
        />
      )}

      <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-sm">
        <p>&gt; WASD / Setas: Mover</p>
        <p>&gt; E: Abrir Baú</p>
        <p>&gt; ESC: Pausar</p>
      </div>
    </div>
  );
}
