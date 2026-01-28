import { WeaponData } from './WeaponTypes';
import { AreaEffectType } from './AreaEffectTypes';

// Tipos de upgrade disponíveis
export enum UpgradeType {
  WEAPON = 'weapon',
  STAT = 'stat',
  ABILITY = 'ability',
  AREA_POWER = 'area_power',
}

// Tipos de stat que podem ser melhorados
export enum StatType {
  MAX_HEALTH = 'max_health',
  SPEED = 'speed',
  DAMAGE = 'damage',
  ATTACK_SPEED = 'attack_speed',
  CRIT_CHANCE = 'crit_chance',
  AREA_OF_EFFECT = 'area_of_effect',
  PROJECTILE_COUNT = 'projectile_count',
  XP_GAIN = 'xp_gain',
}

// Interface para upgrade de estatística
export interface StatUpgrade {
  type: UpgradeType.STAT;
  statType: StatType;
  name: string;
  description: string;
  value: number;
  iconPath?: string;
}

// Interface para upgrade de arma
export interface WeaponUpgrade {
  type: UpgradeType.WEAPON;
  weaponData: WeaponData;
  name: string;
  description: string;
  iconPath?: string;
}

// Interface para upgrade de habilidade especial
export interface AbilityUpgrade {
  type: UpgradeType.ABILITY;
  abilityId: string;
  name: string;
  description: string;
  effect: string;
  iconPath?: string;
}

// Interface para upgrade de poder de área
export interface AreaPowerUpgrade {
  type: UpgradeType.AREA_POWER;
  powerType: AreaEffectType;
  name: string;
  description: string;
  baseDamage: number;
  cooldown: number;
  iconPath?: string;
}

// Union type para todos os upgrades
export type Upgrade = StatUpgrade | WeaponUpgrade | AbilityUpgrade | AreaPowerUpgrade;

// Interface para opções de upgrade apresentadas ao jogador
export interface UpgradeOptions {
  options: Upgrade[];
  rerollsAvailable: number;
}
