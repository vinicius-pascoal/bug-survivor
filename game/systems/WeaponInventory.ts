import { WeaponInstance, WeaponData } from '../types/WeaponTypes';

export interface WeaponSlot {
  weapon: WeaponInstance | null;
  unlocked: boolean;
}

export class WeaponInventory {
  private slots: WeaponSlot[] = [];
  private maxSlots: number = 3; // Começa com 3 slots

  constructor() {
    this.initializeSlots();
  }

  private initializeSlots() {
    // Inicializa 3 slots desbloqueados e 3 bloqueados
    for (let i = 0; i < 6; i++) {
      this.slots.push({
        weapon: null,
        unlocked: i < this.maxSlots,
      });
    }
  }

  // Adiciona uma arma ao inventário
  addWeapon(weaponData: WeaponData): { success: boolean; message: string; slotIndex?: number } {
    // Verifica se há slot disponível
    const emptySlotIndex = this.findEmptySlot();

    if (emptySlotIndex === -1) {
      return {
        success: false,
        message: 'Inventário cheio! Substitua uma arma existente.',
      };
    }

    // Cria instância da arma
    const weaponInstance: WeaponInstance = {
      data: weaponData,
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      abilityActive: false,
      abilityCooldownRemaining: 0,
    };

    this.slots[emptySlotIndex].weapon = weaponInstance;

    return {
      success: true,
      message: `${weaponData.name} adicionada ao inventário!`,
      slotIndex: emptySlotIndex,
    };
  }

  // Substitui uma arma em um slot específico
  replaceWeapon(slotIndex: number, weaponData: WeaponData): { success: boolean; message: string; replacedWeapon?: WeaponData } {
    if (slotIndex < 0 || slotIndex >= this.slots.length) {
      return {
        success: false,
        message: 'Slot inválido!',
      };
    }

    if (!this.slots[slotIndex].unlocked) {
      return {
        success: false,
        message: 'Slot não desbloqueado!',
      };
    }

    const oldWeapon = this.slots[slotIndex].weapon?.data;

    // Cria nova instância da arma
    const weaponInstance: WeaponInstance = {
      data: weaponData,
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      abilityActive: false,
      abilityCooldownRemaining: 0,
    };

    this.slots[slotIndex].weapon = weaponInstance;

    return {
      success: true,
      message: oldWeapon
        ? `${oldWeapon.name} substituída por ${weaponData.name}!`
        : `${weaponData.name} equipada!`,
      replacedWeapon: oldWeapon,
    };
  }

  // Remove uma arma de um slot
  removeWeapon(slotIndex: number): { success: boolean; message: string; removedWeapon?: WeaponData } {
    if (slotIndex < 0 || slotIndex >= this.slots.length) {
      return {
        success: false,
        message: 'Slot inválido!',
      };
    }

    const weapon = this.slots[slotIndex].weapon;
    if (!weapon) {
      return {
        success: false,
        message: 'Slot vazio!',
      };
    }

    this.slots[slotIndex].weapon = null;

    return {
      success: true,
      message: `${weapon.data.name} removida do inventário!`,
      removedWeapon: weapon.data,
    };
  }

  // Encontra o primeiro slot vazio desbloqueado
  private findEmptySlot(): number {
    for (let i = 0; i < this.slots.length; i++) {
      if (this.slots[i].unlocked && !this.slots[i].weapon) {
        return i;
      }
    }
    return -1;
  }

  // Verifica se tem espaço disponível
  hasSpace(): boolean {
    return this.findEmptySlot() !== -1;
  }

  // Desbloqueia um novo slot
  unlockSlot(): { success: boolean; message: string } {
    const lockedSlotIndex = this.slots.findIndex(slot => !slot.unlocked);

    if (lockedSlotIndex === -1) {
      return {
        success: false,
        message: 'Todos os slots já estão desbloqueados!',
      };
    }

    this.slots[lockedSlotIndex].unlocked = true;
    this.maxSlots++;

    return {
      success: true,
      message: `Novo slot de arma desbloqueado! Total: ${this.maxSlots}`,
    };
  }

  // Retorna todas as armas equipadas
  getEquippedWeapons(): WeaponInstance[] {
    return this.slots
      .filter(slot => slot.unlocked && slot.weapon !== null)
      .map(slot => slot.weapon!);
  }

  // Retorna informações sobre os slots
  getSlots(): WeaponSlot[] {
    return [...this.slots];
  }

  // Retorna número de slots desbloqueados
  getMaxSlots(): number {
    return this.maxSlots;
  }

  // Retorna número de armas equipadas
  getEquippedCount(): number {
    return this.slots.filter(slot => slot.unlocked && slot.weapon !== null).length;
  }

  // Atualiza cooldowns e estados das armas
  update(deltaTime: number) {
    this.slots.forEach(slot => {
      if (slot.weapon) {
        // Atualiza cooldown de habilidade
        if (slot.weapon.abilityCooldownRemaining > 0) {
          slot.weapon.abilityCooldownRemaining = Math.max(
            0,
            slot.weapon.abilityCooldownRemaining - deltaTime
          );
        }
      }
    });
  }

  // Adiciona experiência a uma arma específica
  addWeaponExperience(slotIndex: number, amount: number): boolean {
    if (slotIndex < 0 || slotIndex >= this.slots.length) {
      return false;
    }

    const weapon = this.slots[slotIndex].weapon;
    if (!weapon) {
      return false;
    }

    weapon.experience += amount;

    // Verifica se subiu de nível
    if (weapon.experience >= weapon.experienceToNextLevel) {
      weapon.level++;
      weapon.experience -= weapon.experienceToNextLevel;
      weapon.experienceToNextLevel = Math.floor(weapon.experienceToNextLevel * 1.5);
      return true; // Retorna true se subiu de nível
    }

    return false;
  }

  // Ativa habilidade de uma arma
  activateAbility(slotIndex: number): boolean {
    if (slotIndex < 0 || slotIndex >= this.slots.length) {
      return false;
    }

    const weapon = this.slots[slotIndex].weapon;
    if (!weapon) {
      return false;
    }

    // Verifica se está em cooldown
    if (weapon.abilityCooldownRemaining > 0) {
      return false;
    }

    // Ativa a habilidade
    weapon.abilityActive = true;

    // Define cooldown se houver
    if (weapon.data.ability.cooldown) {
      weapon.abilityCooldownRemaining = weapon.data.ability.cooldown;
    }

    return true;
  }

  // Desativa habilidade de uma arma
  deactivateAbility(slotIndex: number) {
    if (slotIndex >= 0 && slotIndex < this.slots.length) {
      const weapon = this.slots[slotIndex].weapon;
      if (weapon) {
        weapon.abilityActive = false;
      }
    }
  }
}
