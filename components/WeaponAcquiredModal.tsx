'use client';

import React from 'react';
import { WeaponData, WeaponRarity } from '@/game/types/WeaponTypes';
import Image from 'next/image';

interface WeaponAcquiredModalProps {
  weapon: WeaponData;
  onConfirm: () => void;
}

export function WeaponAcquiredModal({ weapon, onConfirm }: WeaponAcquiredModalProps) {
  const rarityColors = {
    [WeaponRarity.COMMON]: 'from-gray-400 to-gray-600',
    [WeaponRarity.UNCOMMON]: 'from-green-400 to-green-600',
    [WeaponRarity.RARE]: 'from-blue-400 to-blue-600',
    [WeaponRarity.EPIC]: 'from-purple-400 to-purple-600',
    [WeaponRarity.LEGENDARY]: 'from-yellow-400 to-yellow-600',
  };

  const rarityText = {
    [WeaponRarity.COMMON]: 'Comum',
    [WeaponRarity.UNCOMMON]: 'Incomum',
    [WeaponRarity.RARE]: 'Rara',
    [WeaponRarity.EPIC]: 'Épica',
    [WeaponRarity.LEGENDARY]: 'Lendária',
  };

  const categoryText = {
    sword: 'Espada',
    greatsword: 'Espadão',
    dagger: 'Adaga',
    axe: 'Machado',
    spear: 'Lança',
    special: 'Especial',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full mx-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-gray-700 shadow-2xl overflow-hidden">
        {/* Header com brilho da raridade */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${rarityColors[weapon.rarity]}`} />

        <div className="p-8">
          {/* Título */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Nova Arma Adquirida!</h2>
            <p className={`text-lg font-semibold bg-gradient-to-r ${rarityColors[weapon.rarity]} bg-clip-text text-transparent`}>
              {rarityText[weapon.rarity]}
            </p>
          </div>

          {/* Imagem da arma */}
          <div className="flex justify-center mb-6">
            <div className={`relative w-48 h-48 rounded-xl bg-gradient-to-br ${rarityColors[weapon.rarity]} p-1`}>
              <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={weapon.imagePath}
                  alt={weapon.name}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Informações da arma */}
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-1">{weapon.name}</h3>
              <p className="text-sm text-gray-400">{categoryText[weapon.category]}</p>
            </div>

            <p className="text-gray-300 text-center text-sm">{weapon.description}</p>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Dano</p>
                <p className="text-lg font-bold text-red-400">{weapon.stats.damage}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Vel. Ataque</p>
                <p className="text-lg font-bold text-blue-400">{weapon.stats.attackSpeed.toFixed(1)}/s</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Alcance</p>
                <p className="text-lg font-bold text-green-400">{weapon.stats.range}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Crítico</p>
                <p className="text-lg font-bold text-yellow-400">{(weapon.stats.critChance * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Habilidade especial */}
            <div className={`bg-gradient-to-br ${rarityColors[weapon.rarity]} p-0.5 rounded-lg`}>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${rarityColors[weapon.rarity]}`} />
                  <h4 className="text-sm font-bold text-white">{weapon.ability.name}</h4>
                </div>
                <p className="text-sm text-gray-300">{weapon.ability.description}</p>
                {weapon.ability.cooldown && (
                  <p className="text-xs text-gray-500 mt-2">Recarga: {weapon.ability.cooldown}s</p>
                )}
              </div>
            </div>
          </div>

          {/* Botão de confirmação */}
          <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${rarityColors[weapon.rarity]} hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            Equipar Arma
          </button>
        </div>
      </div>
    </div>
  );
}
