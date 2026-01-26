// Tipos de armas disponíveis no jogo
export type WeaponType =
  | 'wooden-sword'
  | 'bronze-sword'
  | 'bronze-saber'
  | 'blood-dagger'
  | 'blood-sword'
  | 'vampiric-sword'
  | 'dual-carmesim'
  | 'carmesin-dagger'
  | 'gransword'
  | 'amber-greatsword'
  | 'ametist-greatsword'
  | 'diamond-greatsword'
  | 'hammersword'
  | 'flame-sword'
  | 'sunbringer'
  | 'diamond-piercer'
  | 'diamond-shadder'
  | 'diamond'
  | 'scale-sword'
  | 'piercer'
  | 'butcher'
  | 'ametist-butcher'
  | 'mordecostas'
  | 'scarllet'
  | 'old-peace'
  | 'old-hero'
  | 'broken-hero'
  | 'greathero'
  | 'rebuild-hope'
  | 'shatterd-hope';

// Raridade das armas
export enum WeaponRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

// Categorias de armas
export enum WeaponCategory {
  SWORD = 'sword',
  GREATSWORD = 'greatsword',
  DAGGER = 'dagger',
  AXE = 'axe',
  SPEAR = 'spear',
  SPECIAL = 'special',
}

// Interface para as estatísticas de uma arma
export interface WeaponStats {
  damage: number;
  attackSpeed: number; // ataques por segundo
  range: number; // alcance em pixels
  critChance: number; // 0-1
  critMultiplier: number; // multiplicador de crítico
  projectileCount?: number; // número de projéteis
  piercing?: number; // quantos inimigos atravessa
  areaOfEffect?: number; // raio de área de efeito
}

// Interface para habilidade especial da arma
export interface WeaponAbility {
  name: string;
  description: string;
  cooldown?: number; // em segundos
  duration?: number; // em segundos
  effect: string; // descrição do efeito mecânico
}

// Interface completa de uma arma
export interface WeaponData {
  id: WeaponType;
  name: string;
  category: WeaponCategory;
  rarity: WeaponRarity;
  imagePath: string;
  description: string;
  stats: WeaponStats;
  ability: WeaponAbility;
  levelRequirement: number;
}

// Estado de uma arma no inventário
export interface WeaponInstance {
  data: WeaponData;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  abilityActive: boolean;
  abilityCooldownRemaining: number;
}
