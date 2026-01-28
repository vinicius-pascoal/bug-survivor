'use client';

import React from 'react';
import { Upgrade, UpgradeType, StatUpgrade, WeaponUpgrade, AreaPowerUpgrade } from '@/game/types/UpgradeTypes';
import { WeaponRarity } from '@/game/types/WeaponTypes';
import Image from 'next/image';

interface UpgradeSelectionModalProps {
  upgrades: Upgrade[];
  onSelectUpgrade: (upgrade: Upgrade) => void;
  playerLevel: number;
}

export function UpgradeSelectionModal({
  upgrades,
  onSelectUpgrade,
  playerLevel
}: UpgradeSelectionModalProps) {

  const rarityColors = {
    [WeaponRarity.COMMON]: 'from-gray-400 to-gray-600',
    [WeaponRarity.UNCOMMON]: 'from-green-400 to-green-600',
    [WeaponRarity.RARE]: 'from-blue-400 to-blue-600',
    [WeaponRarity.EPIC]: 'from-purple-400 to-purple-600',
    [WeaponRarity.LEGENDARY]: 'from-yellow-400 to-yellow-600',
  };

  const categoryText = {
    sword: 'Espada',
    greatsword: 'Espadão',
    dagger: 'Adaga',
    axe: 'Machado',
    spear: 'Lança',
    special: 'Especial',
  };

  const renderUpgradeCard = (upgrade: Upgrade, index: number) => {
    if (upgrade.type === UpgradeType.WEAPON) {
      const weaponUpgrade = upgrade as WeaponUpgrade;
      const weapon = weaponUpgrade.weaponData;

      return (
        <button
          key={index}
          onClick={() => onSelectUpgrade(upgrade)}
          className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl border-2 border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl overflow-hidden w-full"
        >
          {/* Header com raridade */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[weapon.rarity]}`} />

          <div className="p-3 sm:p-4 md:p-5 lg:p-6">
            {/* Badge de tipo */}
            <div className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3">
              <span className="text-[10px] sm:text-xs font-bold text-cyan-400 bg-cyan-950 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                ARMA
              </span>
            </div>

            {/* Imagem da arma */}
            <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
              <div className={`relative w-14 sm:w-20 md:w-24 lg:w-28 h-14 sm:h-20 md:h-24 lg:h-28 rounded-lg bg-gradient-to-br ${rarityColors[weapon.rarity]} p-0.5`}>
                <div className="w-full h-full bg-gray-900 rounded-md flex items-center justify-center">
                  <Image
                    src={weapon.imagePath}
                    alt={weapon.name}
                    width={80}
                    height={80}
                    className="object-contain w-10 sm:w-16 md:w-20 lg:w-24 h-10 sm:h-16 md:h-20 lg:h-24"
                  />
                </div>
              </div>
            </div>

            {/* Nome e categoria */}
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">{weapon.name}</h3>
            <p className="text-[10px] sm:text-xs text-gray-400 mb-1.5 sm:mb-2 md:mb-3">{categoryText[weapon.category]}</p>

            {/* Descrição */}
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 mb-2 sm:mb-3 md:mb-4 min-h-[32px] sm:min-h-[40px] line-clamp-2">{weapon.description}</p>

            {/* Stats em grid */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <div className="bg-gray-800/50 rounded p-1.5 sm:p-2">
                <p className="text-[9px] sm:text-xs text-gray-400">Dano</p>
                <p className="text-xs sm:text-sm md:text-base font-bold text-red-400">{weapon.stats.damage}</p>
              </div>
              <div className="bg-gray-800/50 rounded p-1.5 sm:p-2">
                <p className="text-[9px] sm:text-xs text-gray-400">Vel. Ataque</p>
                <p className="text-xs sm:text-sm md:text-base font-bold text-blue-400">{weapon.stats.attackSpeed.toFixed(1)}/s</p>
              </div>
            </div>

            {/* Habilidade */}
            <div className={`bg-gradient-to-r ${rarityColors[weapon.rarity]} p-0.5 rounded`}>
              <div className="bg-gray-900 p-1.5 sm:p-2 rounded">
                <p className="text-[10px] sm:text-xs font-semibold text-white line-clamp-1">{weapon.ability.name}</p>
                <p className="text-[9px] sm:text-xs text-gray-400 line-clamp-1">{weapon.ability.description}</p>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-300 pointer-events-none" />
          </div>
        </button>
      );
    } else if (upgrade.type === UpgradeType.STAT) {
      const statUpgrade = upgrade as StatUpgrade;

      return (
        <button
          key={index}
          onClick={() => onSelectUpgrade(upgrade)}
          className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-gray-700 hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden w-full"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600" />

          <div className="p-3 sm:p-4 md:p-5 lg:p-6">
            {/* Badge de tipo */}
            <div className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3">
              <span className="text-[10px] sm:text-xs font-bold text-green-400 bg-green-950 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                STAT
              </span>
            </div>

            {/* Ícone */}
            <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
              <div className="w-14 sm:w-20 md:w-24 h-14 sm:h-20 md:h-24 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-600/20 flex items-center justify-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  {statUpgrade.statType === 'max_health' && '❤️'}
                  {statUpgrade.statType === 'speed' && '⚡'}
                  {statUpgrade.statType === 'damage' && '⚔️'}
                  {statUpgrade.statType === 'attack_speed' && '🗡️'}
                  {statUpgrade.statType === 'crit_chance' && '💥'}
                  {statUpgrade.statType === 'area_of_effect' && '🎯'}
                  {statUpgrade.statType === 'projectile_count' && '🔮'}
                  {statUpgrade.statType === 'xp_gain' && '⭐'}
                </div>
              </div>
            </div>

            {/* Nome */}
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3 line-clamp-1">{statUpgrade.name}</h3>

            {/* Descrição */}
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 mb-2 sm:mb-3 md:mb-4 min-h-[32px] sm:min-h-[40px] md:min-h-[50px] line-clamp-2 sm:line-clamp-3">{statUpgrade.description}</p>

            {/* Valor do upgrade */}
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-1.5 sm:p-2 md:p-3">
              <p className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">Aumento</p>
              <p className="text-base sm:text-xl md:text-2xl font-bold text-green-400">
                {statUpgrade.statType.includes('percent') ||
                  statUpgrade.value < 1 ?
                  `+${(statUpgrade.value * 100).toFixed(0)}%` :
                  `+${statUpgrade.value}`
                }
              </p>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors duration-300 pointer-events-none" />
          </div>
        </button>
      );
    }

    // AREA_POWER Upgrade Card
    if (upgrade.type === UpgradeType.AREA_POWER) {
      const areaPowerUpgrade = upgrade as AreaPowerUpgrade;

      const powerConfig = {
        lightning: { icon: '⚡', color: '#44aaff', bgGradient: 'from-blue-400 to-cyan-600', name: 'Tempestade de Raios' },
        fire: { icon: '🔥', color: '#ff6600', bgGradient: 'from-orange-400 to-red-600', name: 'Inferno Flamejante' },
        atomic: { icon: '☢️', color: '#00ff00', bgGradient: 'from-green-400 to-lime-600', name: 'Explosão Atômica' },
        toxic: { icon: '☣️', color: '#88ff00', bgGradient: 'from-lime-400 to-green-600', name: 'Nuvem Tóxica' },
        electric: { icon: '⚡', color: '#ffff00', bgGradient: 'from-yellow-400 to-amber-600', name: 'Campo Elétrico' },
        'water-fire': { icon: '🌊', color: '#00ccff', bgGradient: 'from-cyan-400 to-blue-600', name: 'Vapor Escaldante' },
        default: { icon: '💥', color: '#ff8800', bgGradient: 'from-orange-400 to-amber-600', name: 'Poder de Área' }
      };

      const config = powerConfig[areaPowerUpgrade.powerType as keyof typeof powerConfig] || powerConfig.default;

      return (
        <button
          key={index}
          onClick={() => onSelectUpgrade(upgrade)}
          className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-gray-700 hover:border-orange-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden w-full"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.bgGradient}`} />

          <div className="p-4 sm:p-6">
            {/* Badge de tipo */}
            <div className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3">
              <span className="text-[10px] sm:text-xs font-bold text-orange-400 bg-orange-950 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                PODER
              </span>
            </div>

            {/* Ícone */}
            <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
              <div className="w-14 sm:w-20 md:w-24 h-14 sm:h-20 md:h-24 rounded-lg bg-gradient-to-br from-orange-400/20 to-amber-600/20 flex items-center justify-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  {config.icon}
                </div>
              </div>
            </div>

            {/* Nome */}
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3 line-clamp-1">{config.name}</h3>

            {/* Descrição */}
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 mb-2 sm:mb-3 md:mb-4 min-h-[32px] sm:min-h-[40px] md:min-h-[50px] line-clamp-2 sm:line-clamp-3">{areaPowerUpgrade.description}</p>

            {/* Estatísticas do poder */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
              <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-1.5 sm:p-2">
                <p className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">Dano</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-orange-400">
                  {areaPowerUpgrade.baseDamage}
                </p>
              </div>
              <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-1.5 sm:p-2">
                <p className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">Cooldown</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-orange-400">
                  {areaPowerUpgrade.cooldown}s
                </p>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-300 pointer-events-none" />
          </div>
        </button>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[95vw] sm:max-w-5xl md:max-w-6xl lg:max-w-7xl my-auto">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 md:mb-6">
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-full mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs md:text-sm font-bold">NÍVEL {playerLevel}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 px-2">Escolha um Upgrade</h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 px-2">Selecione uma melhoria para fortalecer seu personagem</p>
        </div>

        {/* Grid de upgrades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto px-1 sm:px-2">
          {upgrades.map((upgrade, index) => renderUpgradeCard(upgrade, index))}
        </div>

        {/* Dica */}
        <div className="text-center mt-6 sm:mt-8 px-2">
          <p className="text-xs sm:text-sm text-gray-500">
            Escolha sabiamente - cada decisão afeta sua build!
          </p>
        </div>
      </div>
    </div>
  );
}
