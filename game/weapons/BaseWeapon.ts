import { WeaponData, WeaponInstance } from '../types/WeaponTypes';
import { StatusEffectManager, StatusEffectType } from '../systems/StatusEffectManager';
import { ParticleSystem } from '../systems/ParticleSystem';

export interface WeaponAttackResult {
  damage: number;
  hitEnemies: string[];
  effects: Array<{ enemyId: string; effectType: StatusEffectType; duration: number }>;
  particleEffects: Array<{ x: number; y: number; type: string }>;
}

// Classe base para todas as armas
export abstract class BaseWeapon {
  protected weaponInstance: WeaponInstance;
  protected lastAttackTime: number = 0;
  protected attackCooldown: number;
  protected comboCount: number = 0;
  protected statusEffectManager: StatusEffectManager;
  protected particleSystem: ParticleSystem;

  constructor(
    weaponInstance: WeaponInstance,
    statusEffectManager: StatusEffectManager,
    particleSystem: ParticleSystem
  ) {
    this.weaponInstance = weaponInstance;
    this.attackCooldown = 1 / weaponInstance.data.stats.attackSpeed;
    this.statusEffectManager = statusEffectManager;
    this.particleSystem = particleSystem;
  }

  // Método abstrato que cada arma deve implementar
  abstract attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>,
    playerAngle?: number
  ): WeaponAttackResult;

  // Método abstrato para renderização
  abstract render(ctx: CanvasRenderingContext2D, playerX: number, playerY: number): void;

  // Atualiza a arma
  update(deltaTime: number, playerX: number, playerY: number, enemies: any[], playerAngle: number = 0): WeaponAttackResult | null {
    this.lastAttackTime += deltaTime;

    // Verifica se pode atacar
    if (this.lastAttackTime >= this.attackCooldown) {
      this.lastAttackTime = 0;
      return this.attack(playerX, playerY, enemies, playerAngle);
    }

    return null;
  }

  // Calcula dano base com crítico
  protected calculateDamage(): number {
    const baseDamage = this.weaponInstance.data.stats.damage * (1 + (this.weaponInstance.level - 1) * 0.1);

    // Verifica crítico
    if (Math.random() < this.weaponInstance.data.stats.critChance) {
      return baseDamage * this.weaponInstance.data.stats.critMultiplier;
    }

    return baseDamage;
  }

  // Verifica se um ponto está dentro do alcance de ataque
  protected isInRange(
    targetX: number,
    targetY: number,
    playerX: number,
    playerY: number,
    range?: number
  ): boolean {
    const attackRange = range || this.weaponInstance.data.stats.range;
    const distance = Math.sqrt(
      Math.pow(targetX - playerX, 2) + Math.pow(targetY - playerY, 2)
    );
    return distance <= attackRange;
  }

  // Aplica lifesteal ao jogador (retorna HP para curar)
  protected applyLifesteal(damage: number): number {
    const effect = this.weaponInstance.data.ability.effect;

    if (effect.includes('lifesteal')) {
      const match = effect.match(/lifesteal_(\d+)/);
      if (match) {
        const percent = parseInt(match[1]) / 100;
        return damage * percent;
      }
    }

    return 0;
  }

  // Aplica efeitos de sangramento
  protected applyBleed(enemyId: string, x: number, y: number) {
    this.statusEffectManager.applyEffect(enemyId, {
      type: StatusEffectType.BLEED,
      duration: 3,
      damage: this.weaponInstance.data.stats.damage * 0.2,
      stackCount: 1,
      maxStacks: 5,
    });

    this.particleSystem.createBloodEffect(x, y);
  }

  // Aplica efeitos de queimadura
  protected applyBurn(enemyId: string, x: number, y: number) {
    this.statusEffectManager.applyEffect(enemyId, {
      type: StatusEffectType.BURN,
      duration: 4,
      damage: this.weaponInstance.data.stats.damage * 0.15,
    });

    this.particleSystem.createFireEffect(x, y);
  }

  // Aplica efeitos de lentidão
  protected applySlow(enemyId: string, slowAmount: number = 0.5, duration: number = 2) {
    this.statusEffectManager.applyEffect(enemyId, {
      type: StatusEffectType.SLOW,
      duration,
      slowAmount,
    });
  }

  // Encontra inimigos em área circular
  protected findEnemiesInRadius(
    centerX: number,
    centerY: number,
    radius: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>
  ): Array<{ id: string; x: number; y: number; width: number; height: number }> {
    return enemies.filter(enemy => {
      const distance = Math.sqrt(
        Math.pow(enemy.x - centerX, 2) + Math.pow(enemy.y - centerY, 2)
      );
      return distance <= radius + enemy.width / 2;
    });
  }

  // Encontra o inimigo mais próximo
  protected findNearestEnemy(
    x: number,
    y: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>
  ): { id: string; x: number; y: number; width: number; height: number; distance: number } | null {
    let nearest = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
      const distance = Math.sqrt(Math.pow(enemy.x - x, 2) + Math.pow(enemy.y - y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...enemy, distance };
      }
    });

    return nearest;
  }

  // Getters
  getWeaponData(): WeaponData {
    return this.weaponInstance.data;
  }

  getWeaponInstance(): WeaponInstance {
    return this.weaponInstance;
  }

  getCooldownProgress(): number {
    return Math.min(1, this.lastAttackTime / this.attackCooldown);
  }
}
