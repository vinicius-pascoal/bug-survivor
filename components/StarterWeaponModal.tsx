'use client';

import React from 'react';
import { WeaponUpgrade } from '@/game/types/UpgradeTypes';
import { WeaponRarity } from '@/game/types/WeaponTypes';
import Image from 'next/image';

interface StarterWeaponModalProps {
  weapons: WeaponUpgrade[];
  onSelectWeapon: (weapon: WeaponUpgrade) => void;
}

export function StarterWeaponModal({ weapons, onSelectWeapon }: StarterWeaponModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-7xl my-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Escolha Sua Arma Inicial
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-1 sm:mb-2">
            Esta será sua primeira arma na batalha
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Você poderá adquirir mais armas durante o jogo
          </p>
        </div>

        {/* Grid de armas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4">
          {weapons.map((weaponUpgrade, index) => {
            const weapon = weaponUpgrade.weaponData;

            return (
              <button
                key={index}
                onClick={() => onSelectWeapon(weaponUpgrade)}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden transform w-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Brilho da raridade */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${rarityColors[weapon.rarity]}`} />

                <div className="p-4 sm:p-6">
                  {/* Imagem da arma */}
                  <div className="mb-3 sm:mb-4 flex justify-center">
                    <div className={`relative w-20 sm:w-32 h-20 sm:h-32 rounded-xl bg-gradient-to-br ${rarityColors[weapon.rarity]} p-1 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                        <Image
                          src={weapon.imagePath}
                          alt={weapon.name}
                          width={110}
                          height={110}
                          className="object-contain w-16 sm:w-28 h-16 sm:h-28"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nome e categoria */}
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 text-center">{weapon.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 text-center">{categoryText[weapon.category]}</p>

                  {/* Descrição */}
                  <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 text-center min-h-[40px] sm:min-h-[60px] line-clamp-3">
                    {weapon.description}
                  </p>

                  {/* Stats principais */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">Dano</p>
                      <p className="text-lg sm:text-xl font-bold text-red-400">{weapon.stats.damage}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">Velocidade</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-400">{weapon.stats.attackSpeed.toFixed(1)}</p>
                    </div>
                  </div>

                  {/* Habilidade especial */}
                  <div className={`bg-gradient-to-r ${rarityColors[weapon.rarity]} p-0.5 rounded-lg`}>
                    <div className="bg-gray-900 p-2 sm:p-3 rounded-md">
                      <p className="text-xs sm:text-sm font-semibold text-white mb-1 text-center">
                        {weapon.ability.name}
                      </p>
                      <p className="text-xs text-gray-400 text-center line-clamp-2">
                        {weapon.ability.description}
                      </p>
                    </div>
                  </div>

                  {/* Indicador de seleção */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs sm:text-sm font-bold text-cyan-400 bg-cyan-950 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-cyan-500 whitespace-nowrap">
                      SELECIONAR
                    </span>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-300 pointer-events-none rounded-2xl" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Dica adicional */}
        <div className="text-center mt-6 sm:mt-8 px-2">
          <div className="inline-block bg-gray-800/50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-700">
            <p className="text-xs sm:text-sm text-gray-400">
              💡 <span className="text-white font-semibold">Dica:</span> Cada arma tem um estilo único de combate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
