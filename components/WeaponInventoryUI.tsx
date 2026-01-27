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

  // Filtra apenas slots desbloqueados (equipados ou vazios mas disponíveis)
  const unlockedSlots = slots.filter(s => s.unlocked);

  return (
    <div className="fixed top-2 right-2 z-40">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-1.5 shadow-lg">
        <div className="flex items-center gap-1.5">
          {/* Slots de armas - apenas desbloqueados */}
          {unlockedSlots.map((slot, index) => (
            <div
              key={index}
              className={`relative w-9 h-9 rounded-md border transition-all flex-shrink-0 ${slot.weapon
                  ? `${rarityColors[slot.weapon.data.rarity]} bg-gray-800`
                  : 'border-gray-600 bg-gray-800/40'
                }`}
            >
              {slot.weapon ? (
                <>
                  {/* Imagem da arma */}
                  <div className="absolute inset-0 flex items-center justify-center p-0.5">
                    <Image
                      src={slot.weapon.data.imagePath}
                      alt={slot.weapon.data.name}
                      width={32}
                      height={32}
                      className="object-contain w-7 h-7"
                    />
                  </div>

                  {/* Nível da arma */}
                  <div className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-gray-900">
                    {slot.weapon.level}
                  </div>

                  {/* Cooldown indicator */}
                  {slot.weapon.abilityCooldownRemaining > 0 && (
                    <div className="absolute inset-0 bg-gray-900/70 rounded-md flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        {Math.ceil(slot.weapon.abilityCooldownRemaining)}s
                      </span>
                    </div>
                  )}
                </>
              ) : (
                // Slot vazio mas desbloqueado
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              )}

              {/* Tooltip no hover */}
              {slot.weapon && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="bg-gray-900 border border-gray-700 rounded-md p-1.5 whitespace-nowrap text-xs shadow-xl">
                    <p className="text-white font-bold text-[11px]">{slot.weapon.data.name}</p>
                    <p className="text-gray-400 text-[10px]">Nível {slot.weapon.level}</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">{slot.weapon.data.ability.name}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
