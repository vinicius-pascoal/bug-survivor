export type CombatStyle = 'melee' | 'ranged' | 'boss-melee' | 'boss-ranged' | 'boss-charger';

export interface EnemyDefinition {
  id: string;
  name: string;
  sprite: string;
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  xpValue: number;
  combatStyle: CombatStyle;
  weight?: number;
  attackCooldown?: number;
  projectileSpeed?: number;
  projectileSize?: number;
  preferredDistance?: number;
  range?: number;
  isBoss?: boolean;
  bossBarColor?: string;
}

export interface EnemyProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  life: number;
}
