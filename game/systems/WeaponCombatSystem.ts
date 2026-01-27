import { BaseWeapon, WeaponAttackResult } from '../weapons/BaseWeapon';
import { WeaponInstance, WeaponType } from '../types/WeaponTypes';
import { StatusEffectManager } from './StatusEffectManager';
import { ParticleSystem } from './ParticleSystem';
import {
  SwordWeapon,
  VampiricDaggerWeapon,
  GreatswordWeapon,
  FlameSwordWeapon,
  PiercerWeapon,
} from '../weapons/SpecificWeapons';

export class WeaponCombatSystem {
  private activeWeapons: Map<string, { weapon: BaseWeapon; slotIndex: number }> = new Map();
  private statusEffectManager: StatusEffectManager;
  private particleSystem: ParticleSystem;
  private slotAngleOffsets = [0, Math.PI / 3, -Math.PI / 3, (2 * Math.PI) / 3, -(2 * Math.PI) / 3, Math.PI];

  constructor() {
    this.statusEffectManager = new StatusEffectManager();
    this.particleSystem = new ParticleSystem();
  }

  // Adiciona uma arma ao sistema de combate
  addWeapon(weaponInstance: WeaponInstance, slotIndex: number): boolean {
    try {
      const weapon = this.createWeaponInstance(weaponInstance);
      if (weapon) {
        this.activeWeapons.set(weaponInstance.data.id, { weapon, slotIndex });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding weapon:', error);
      return false;
    }
  }

  // Remove uma arma do sistema
  removeWeapon(weaponId: WeaponType): boolean {
    return this.activeWeapons.delete(weaponId);
  }

  // Cria instância específica da arma baseado no tipo
  private createWeaponInstance(weaponInstance: WeaponInstance): BaseWeapon | null {
    const weaponId = weaponInstance.data.id;

    // Espadas básicas
    if (
      weaponId === 'wooden-sword' ||
      weaponId === 'bronze-sword' ||
      weaponId === 'bronze-saber' ||
      weaponId === 'blood-sword' ||
      weaponId === 'scale-sword' ||
      weaponId === 'old-peace' ||
      weaponId === 'old-hero' ||
      weaponId === 'broken-hero' ||
      weaponId === 'rebuild-hope' ||
      weaponId === 'shatterd-hope'
    ) {
      return new SwordWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
    }

    // Adagas vampíricas
    if (
      weaponId === 'blood-dagger' ||
      weaponId === 'vampiric-sword' ||
      weaponId === 'carmesin-dagger' ||
      weaponId === 'dual-carmesim'
    ) {
      return new VampiricDaggerWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
    }

    // Espadões
    if (
      weaponId === 'gransword' ||
      weaponId === 'amber-greatsword' ||
      weaponId === 'ametist-greatsword' ||
      weaponId === 'diamond-greatsword' ||
      weaponId === 'hammersword' ||
      weaponId === 'greathero'
    ) {
      return new GreatswordWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
    }

    // Armas de fogo
    if (weaponId === 'flame-sword' || weaponId === 'sunbringer') {
      return new FlameSwordWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
    }

    // Perfuradores
    if (weaponId === 'piercer' || weaponId === 'diamond-piercer') {
      return new PiercerWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
    }

    // Machados - usa o mesmo sistema de espadão por enquanto
    if (
      weaponId === 'butcher' ||
      weaponId === 'ametist-butcher' ||
      weaponId === 'mordecostas'
    ) {
      return new GreatswordWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
    }

    // Especiais - usa espada básica como fallback
    if (
      weaponId === 'diamond-shadder' ||
      weaponId === 'diamond' ||
      weaponId === 'scarllet'
    ) {
      return new SwordWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
    }

    console.warn(`Weapon ${weaponId} not implemented yet, using basic sword`);
    return new SwordWeapon(weaponInstance, this.statusEffectManager, this.particleSystem);
  }

  // Atualiza todas as armas e retorna resultados de combate
  update(
    deltaTime: number,
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number; active: boolean }>,
    playerAngle: number = 0
  ): {
    totalDamage: Map<string, number>;
    totalLifesteal: number;
  } {
    const damageByEnemy = new Map<string, number>();
    let totalLifesteal = 0;

    // Atualiza sistema de partículas
    this.particleSystem.update(deltaTime);

    // Atualiza efeitos de status e aplica dano
    const statusResults = this.statusEffectManager.update(deltaTime);
    statusResults.forEach((result, enemyId) => {
      const currentDamage = damageByEnemy.get(enemyId) || 0;
      damageByEnemy.set(enemyId, currentDamage + result.damage);
    });

    // Filtra apenas inimigos ativos
    const activeEnemies = enemies.filter(e => e.active);

    // Atualiza cada arma
    this.activeWeapons.forEach(({ weapon, slotIndex }) => {
      const weaponAngle = this.getSlotAngle(slotIndex, playerAngle);
      const result = weapon.update(deltaTime, playerX, playerY, activeEnemies, weaponAngle);

      if (result) {
        // Acumula dano por inimigo
        result.hitEnemies.forEach(enemyId => {
          const currentDamage = damageByEnemy.get(enemyId) || 0;
          damageByEnemy.set(enemyId, currentDamage + result.damage / result.hitEnemies.length);
        });

        // Calcula lifesteal total
        const weaponData = weapon.getWeaponData();
        if (weaponData.ability.effect.includes('lifesteal')) {
          const match = weaponData.ability.effect.match(/lifesteal_(\d+)/);
          if (match) {
            const percent = parseInt(match[1]) / 100;
            totalLifesteal += result.damage * percent;
          }
        }
      }
    });

    return {
      totalDamage: damageByEnemy,
      totalLifesteal,
    };
  }

  // Renderiza todas as armas ativas
  render(ctx: CanvasRenderingContext2D, playerX: number, playerY: number) {
    // Renderiza partículas primeiro (atrás de tudo)
    this.particleSystem.render(ctx);

    // Renderiza cada arma
    this.activeWeapons.forEach(({ weapon }) => {
      weapon.render(ctx, playerX, playerY);
    });
  }

  // Limpa todas as armas
  clearAll() {
    this.activeWeapons.clear();
    this.statusEffectManager.clearAll();
    this.particleSystem.clear();
  }

  // Sincroniza com o inventário do jogador
  syncWithInventory(equippedSlots: Array<{ weapon: WeaponInstance; slotIndex: number }>) {
    // Remove armas que não estão mais equipadas
    const equippedIds = new Set(equippedSlots.map(slot => slot.weapon.data.id));
    const toRemove: string[] = [];

    this.activeWeapons.forEach((_, weaponId) => {
      if (!equippedIds.has(weaponId as WeaponType)) {
        toRemove.push(weaponId);
      }
    });

    toRemove.forEach(id => this.removeWeapon(id as WeaponType));

    // Adiciona novas armas e atualiza ângulos dos slots existentes
    equippedSlots.forEach(({ weapon, slotIndex }) => {
      const existing = this.activeWeapons.get(weapon.data.id);
      if (existing) {
        existing.slotIndex = slotIndex;
      } else {
        this.addWeapon(weapon, slotIndex);
      }
    });
  }

  // Retorna o sistema de partículas (para uso externo se necessário)
  getParticleSystem(): ParticleSystem {
    return this.particleSystem;
  }

  // Retorna o gerenciador de efeitos de status
  getStatusEffectManager(): StatusEffectManager {
    return this.statusEffectManager;
  }

  private getSlotAngle(slotIndex: number, playerAngle: number): number {
    const offset = this.slotAngleOffsets[slotIndex] ?? (2 * Math.PI * (slotIndex % this.slotAngleOffsets.length)) / this.slotAngleOffsets.length;
    return playerAngle + offset;
  }

  // Retorna número de armas ativas
  getActiveWeaponCount(): number {
    return this.activeWeapons.size;
  }

  // Retorna array de armas ativas
  getActiveWeapons(): BaseWeapon[] {
    return Array.from(this.activeWeapons.values());
  }
}
