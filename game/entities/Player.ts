import { GAME_CONFIG } from '../config/gameConfig';
import { WeaponInventory } from '../systems/WeaponInventory';
import { WeaponData } from '../types/WeaponTypes';
import { WeaponCombatSystem } from '../systems/WeaponCombatSystem';
import { Enemy } from './Enemy';
import { SpriteAnimationSystem } from '../systems/SpriteAnimationSystem';

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export class Player {
  private state: PlayerState;
  private weaponInventory: WeaponInventory;
  private combatSystem: WeaponCombatSystem;
  private levelUpCallbacks: Array<(level: number) => void> = [];
  private spriteSystem: SpriteAnimationSystem;
  private lastInput: { x: number; y: number } = { x: 0, y: 0 };

  constructor(x: number, y: number) {
    this.state = {
      x,
      y,
      width: GAME_CONFIG.player.size,
      height: GAME_CONFIG.player.size,
      speed: GAME_CONFIG.player.speed,
      health: GAME_CONFIG.player.maxHealth,
      maxHealth: GAME_CONFIG.player.maxHealth,
      level: 1,
      xp: 0,
      xpToNextLevel: GAME_CONFIG.xp.levelUpBase,
    };
    this.weaponInventory = new WeaponInventory();
    this.combatSystem = new WeaponCombatSystem();
    this.spriteSystem = new SpriteAnimationSystem();
  }

  update(deltaTime: number, input: { x: number; y: number }, enemies: Enemy[]) {
    // Store input for animation
    this.lastInput = input;
    
    // Update position based on input
    this.state.x += input.x * this.state.speed * deltaTime;
    this.state.y += input.y * this.state.speed * deltaTime;

    // Update sprite animation
    this.spriteSystem.update(deltaTime, input);

    // Update weapon inventory
    this.weaponInventory.update(deltaTime);

    // Sync combat system with inventory
    const equippedWeapons = this.weaponInventory.getSlots()
      .filter(slot => slot.weapon !== null)
      .map(slot => slot.weapon!);
    this.combatSystem.syncWithInventory(equippedWeapons);

    // Convert enemies to the format expected by combat system
    const enemyData = enemies.map(enemy => {
      const state = enemy.getState();
      return {
        id: state.id,
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        active: state.active
      };
    });

    // Update combat system (handles attacks, effects, particles)
    const combatResults = this.combatSystem.update(deltaTime, this.state.x, this.state.y, enemyData);

    // Apply damage to enemies
    combatResults.totalDamage.forEach((damage: number, enemyId: string) => {
      const enemy = enemies.find(e => e.getState().id === enemyId);
      if (enemy) {
        enemy.takeDamage(damage);
      }
    });

    // Apply lifesteal healing
    if (combatResults.totalLifesteal > 0) {
      this.heal(combatResults.totalLifesteal);
    }

    // Keep player in bounds (will be clamped by systems)
  }

  render(ctx: CanvasRenderingContext2D) {
    // Render weapon effects first (behind player)
    this.combatSystem.render(ctx, this.state.x, this.state.y);

    // Draw player sprite (visual maior que hitbox)
    const spriteSize = GAME_CONFIG.player.spriteSize || this.state.width * 2;
    this.spriteSystem.render(ctx, this.state.x, this.state.y, spriteSize, spriteSize);
  }

  getState(): PlayerState {
    return this.state; // Return direct reference for updates
  }

  getStateCopy(): PlayerState {
    return { ...this.state }; // Return copy when needed
  }

  getPosition(): { x: number; y: number } {
    return { x: this.state.x, y: this.state.y };
  }

  takeDamage(damage: number): boolean {
    this.state.health = Math.max(0, this.state.health - damage);
    return this.state.health <= 0;
  }

  gainXP(amount: number): boolean {
    this.state.xp += amount;
    if (this.state.xp >= this.state.xpToNextLevel) {
      this.levelUp();
      return true;
    }
    return false;
  }

  private levelUp() {
    this.state.level++;
    this.state.xp -= this.state.xpToNextLevel;
    this.state.xpToNextLevel = Math.floor(
      GAME_CONFIG.xp.levelUpBase * Math.pow(GAME_CONFIG.xp.levelUpMultiplier, this.state.level - 1)
    );

    // Desbloqueia novo slot de arma a cada 5 níveis
    if (this.state.level % 5 === 0 && this.state.level > 0) {
      const result = this.weaponInventory.unlockSlot();
      if (result.success) {
        console.log(result.message);
      }
    }

    // Chama callbacks de level up
    this.levelUpCallbacks.forEach(callback => callback(this.state.level));
  }

  heal(amount: number) {
    this.state.health = Math.min(this.state.maxHealth, this.state.health + amount);
  }

  increaseMaxHealth(amount: number) {
    this.state.maxHealth += amount;
  }

  // Métodos de inventário de armas
  getWeaponInventory(): WeaponInventory {
    return this.weaponInventory;
  }

  addWeapon(weaponData: WeaponData) {
    return this.weaponInventory.addWeapon(weaponData);
  }

  replaceWeapon(slotIndex: number, weaponData: WeaponData) {
    return this.weaponInventory.replaceWeapon(slotIndex, weaponData);
  }

  removeWeapon(slotIndex: number) {
    return this.weaponInventory.removeWeapon(slotIndex);
  }

  hasWeaponSpace(): boolean {
    return this.weaponInventory.hasSpace();
  }

  // Registra callback para quando subir de nível
  onLevelUp(callback: (level: number) => void) {
    this.levelUpCallbacks.push(callback);
  }
}
