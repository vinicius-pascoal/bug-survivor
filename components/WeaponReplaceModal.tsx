'use client';

import React from 'react';
import { WeaponData, WeaponRarity } from '@/game/types/WeaponTypes';
import { WeaponSlot } from '@/game/systems/WeaponInventory';
import Image from 'next/image';

interface WeaponReplaceModalProps {
  newWeapon: WeaponData;
  currentSlots: WeaponSlot[];
  onReplace: (slotIndex: number) => void;
  onDiscard: () => void;
}

export function WeaponReplaceModal({ newWeapon, currentSlots, onReplace, onDiscard }: WeaponReplaceModalProps) {
  const rarityColors = {
    [WeaponRarity.COMMON]: 'border-gray-400',
    [WeaponRarity.UNCOMMON]: 'border-green-400',
    [WeaponRarity.RARE]: 'border-blue-400',
    [WeaponRarity.EPIC]: 'border-purple-400',
    [WeaponRarity.LEGENDARY]: 'border-yellow-400',
  };

  const rarityBg = {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative max-w-4xl w-full my-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${rarityBg[newWeapon.rarity]}`} />

        <div className="p-4 sm:p-6">
          {/* Título */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Inventário Cheio!</h2>
            <p className="text-xs sm:text-sm text-gray-400">Substitua uma arma existente ou descarte a nova arma</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Nova arma */}
            <div className={`bg-gradient-to-br ${rarityBg[newWeapon.rarity]} p-0.5 rounded-xl`}>
              <div className="bg-gray-900 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-gray-400 mb-2 text-center">NOVA ARMA</p>
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="relative w-16 sm:w-24 h-16 sm:h-24">
                    <Image
                      src={newWeapon.imagePath}
                      alt={newWeapon.name}
                      width={96}
                      height={96}
                      className="object-contain w-16 sm:w-24 h-16 sm:h-24"
                    />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white text-center mb-1">{newWeapon.name}</h3>
                <p className={`text-xs font-semibold text-center mb-2 sm:mb-3 bg-gradient-to-r ${rarityBg[newWeapon.rarity]} bg-clip-text text-transparent`}>
                  {rarityText[newWeapon.rarity]}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-800/50 rounded p-2 text-center">
                    <p className="text-gray-400">Dano</p>
                    <p className="text-red-400 font-bold">{newWeapon.stats.damage}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded p-2 text-center">
                    <p className="text-gray-400">Vel.</p>
                    <p className="text-blue-400 font-bold">{newWeapon.stats.attackSpeed.toFixed(1)}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 bg-gray-800/30 rounded p-2">
                  <p className="text-xs font-semibold text-white mb-1 line-clamp-1">{newWeapon.ability.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{newWeapon.ability.description}</p>
                </div>
              </div>
            </div>

            {/* Armas atuais */}
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs text-gray-400 mb-2 text-center">SUAS ARMAS ATUAIS</p>
              {currentSlots
                .filter(slot => slot.unlocked && slot.weapon)
                .map((slot, index) => {
                  const weapon = slot.weapon!;
                  return (
                    <button
                      key={index}
                      onClick={() => onReplace(currentSlots.findIndex(s => s === slot))}
                      className={`w-full bg-gray-800/50 hover:bg-gray-700/50 border-2 ${rarityColors[weapon.data.rarity]} rounded-lg p-2 sm:p-3 transition-all hover:scale-102`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative w-12 sm:w-16 h-12 sm:h-16 flex-shrink-0">
                          <Image
                            src={weapon.data.imagePath}
                            alt={weapon.data.name}
                            width={64}
                            height={64}
                            className="object-contain w-12 sm:w-16 h-12 sm:h-16"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">{weapon.data.name}</h4>
                          <p className="text-xs text-gray-400 mb-1">Nível {weapon.level}</p>
                          <div className="flex gap-1 sm:gap-2 text-xs">
                            <span className="text-red-400">⚔ {weapon.data.stats.damage}</span>
                            <span className="text-blue-400">⚡ {weapon.data.stats.attackSpeed.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          →
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Botão de descartar */}
          <button
            onClick={onDiscard}
            className="w-full py-2 sm:py-3 rounded-xl font-bold text-white text-sm sm:text-base bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Descartar Nova Arma
          </button>
        </div>
      </div>
    </div>
  );
}
