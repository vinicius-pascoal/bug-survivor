'use client';

import React from 'react';
import { Upgrade, UpgradeType, StatUpgrade, WeaponUpgrade } from '@/game/types/UpgradeTypes';
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
          className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden w-full"
        >
          {/* Header com raridade */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[weapon.rarity]}`} />

          <div className="p-4 sm:p-6">
            {/* Badge de tipo */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-1 rounded">
                ARMA
              </span>
            </div>

            {/* Imagem da arma */}
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className={`relative w-16 sm:w-24 h-16 sm:h-24 rounded-lg bg-gradient-to-br ${rarityColors[weapon.rarity]} p-0.5`}>
                <div className="w-full h-full bg-gray-900 rounded-md flex items-center justify-center">
                  <Image
                    src={weapon.imagePath}
                    alt={weapon.name}
                    width={80}
                    height={80}
                    className="object-contain w-12 sm:w-20 h-12 sm:h-20"
                  />
                </div>
              </div>
            </div>

            {/* Nome e categoria */}
            <h3 className="text-base sm:text-xl font-bold text-white mb-1">{weapon.name}</h3>
            <p className="text-xs text-gray-400 mb-2 sm:mb-3">{categoryText[weapon.category]}</p>

            {/* Descrição */}
            <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 min-h-[40px] line-clamp-2">{weapon.description}</p>

            {/* Stats em grid */}
            <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-3">
              <div className="bg-gray-800/50 rounded p-2">
                <p className="text-xs text-gray-400">Dano</p>
                <p className="text-xs sm:text-sm font-bold text-red-400">{weapon.stats.damage}</p>
              </div>
              <div className="bg-gray-800/50 rounded p-2">
                <p className="text-xs text-gray-400">Vel. Ataque</p>
                <p className="text-xs sm:text-sm font-bold text-blue-400">{weapon.stats.attackSpeed.toFixed(1)}/s</p>
              </div>
            </div>

            {/* Habilidade */}
            <div className={`bg-gradient-to-r ${rarityColors[weapon.rarity]} p-0.5 rounded`}>
              <div className="bg-gray-900 p-2 rounded">
                <p className="text-xs font-semibold text-white line-clamp-1">{weapon.ability.name}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{weapon.ability.description}</p>
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

          <div className="p-4 sm:p-6">
            {/* Badge de tipo */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <span className="text-xs font-bold text-green-400 bg-green-950 px-2 py-1 rounded">
                STAT
              </span>
            </div>

            {/* Ícone */}
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-600/20 flex items-center justify-center">
                <div className="text-3xl sm:text-5xl">
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
            <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3">{statUpgrade.name}</h3>

            {/* Descrição */}
            <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 min-h-[40px] sm:min-h-[60px] line-clamp-3">{statUpgrade.description}</p>

            {/* Valor do upgrade */}
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-gray-400 mb-1">Aumento</p>
              <p className="text-xl sm:text-2xl font-bold text-green-400">
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

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-6xl my-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-bold">NÍVEL {playerLevel}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">Escolha um Upgrade</h2>
          <p className="text-xs sm:text-sm text-gray-400">Selecione uma melhoria para fortalecer seu personagem</p>
        </div>

        {/* Grid de upgrades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-h-[70vh] overflow-y-auto px-2">
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
