'use client';

import React from 'react';
import { WeaponSlot } from '@/game/systems/WeaponInventory';
import { WeaponRarity } from '@/game/types/WeaponTypes';
import Image from 'next/image';

interface WeaponInventoryUIProps {
  slots: WeaponSlot[];
  playerLevel: number;
}

export function WeaponInventoryUI({ slots, playerLevel }: WeaponInventoryUIProps) {
  const rarityColors = {
    [WeaponRarity.COMMON]: 'border-gray-400 shadow-gray-400/50',
    [WeaponRarity.UNCOMMON]: 'border-green-400 shadow-green-400/50',
    [WeaponRarity.RARE]: 'border-blue-400 shadow-blue-400/50',
    [WeaponRarity.EPIC]: 'border-purple-400 shadow-purple-400/50',
    [WeaponRarity.LEGENDARY]: 'border-yellow-400 shadow-yellow-400/50',
  };

  const nextUnlockLevel = Math.ceil(playerLevel / 5) * 5;
  const slotsUnlocked = slots.filter(s => s.unlocked).length;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-3 shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Slots de armas */}
          {slots.slice(0, 6).map((slot, index) => (
            <div
              key={index}
              className={`relative w-16 h-16 rounded-xl border-2 transition-all ${slot.unlocked
                  ? slot.weapon
                    ? `${rarityColors[slot.weapon.data.rarity]} bg-gray-800`
                    : 'border-gray-600 bg-gray-800/50'
                  : 'border-gray-700 bg-gray-900/50'
                }`}
            >
              {slot.weapon ? (
                <>
                  {/* Imagem da arma */}
                  <div className="absolute inset-0 flex items-center justify-center p-1">
                    <Image
                      src={slot.weapon.data.imagePath}
                      alt={slot.weapon.data.name}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>

                  {/* Nível da arma */}
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                    {slot.weapon.level}
                  </div>

                  {/* Cooldown indicator */}
                  {slot.weapon.abilityCooldownRemaining > 0 && (
                    <div className="absolute inset-0 bg-gray-900/60 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {Math.ceil(slot.weapon.abilityCooldownRemaining)}s
                      </span>
                    </div>
                  )}
                </>
              ) : slot.unlocked ? (
                // Slot vazio mas desbloqueado
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              ) : (
                // Slot bloqueado
                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Tooltip no hover */}
              {slot.weapon && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-2 whitespace-nowrap text-xs">
                    <p className="text-white font-bold">{slot.weapon.data.name}</p>
                    <p className="text-gray-400">Nível {slot.weapon.level}</p>
                    <p className="text-gray-500 text-xs mt-1">{slot.weapon.data.ability.name}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Info do próximo desbloqueio */}
          {slotsUnlocked < 6 && (
            <div className="ml-2 text-xs text-gray-400">
              <p className="font-semibold text-yellow-400">Próximo slot</p>
              <p>Nível {nextUnlockLevel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
