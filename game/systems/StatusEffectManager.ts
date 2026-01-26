// Sistema de efeitos de status que podem ser aplicados aos inimigos
export enum StatusEffectType {
  BLEED = 'bleed',
  BURN = 'burn',
  SLOW = 'slow',
  STUN = 'stun',
  FREEZE = 'freeze',
  POISON = 'poison',
}

export interface StatusEffect {
  type: StatusEffectType;
  duration: number;
  damage?: number; // Dano por segundo (para DoTs)
  slowAmount?: number; // 0-1, percentual de redução de velocidade
  stackCount?: number; // Número de stacks acumulados
  maxStacks?: number; // Máximo de stacks permitidos
}

export class StatusEffectManager {
  private effects: Map<string, StatusEffect[]> = new Map();

  // Aplica um efeito a uma entidade
  applyEffect(entityId: string, effect: StatusEffect) {
    if (!this.effects.has(entityId)) {
      this.effects.set(entityId, []);
    }

    const entityEffects = this.effects.get(entityId)!;
    const existingEffect = entityEffects.find(e => e.type === effect.type);

    if (existingEffect) {
      // Se o efeito já existe, atualiza ou empilha
      if (effect.stackCount !== undefined && effect.maxStacks !== undefined) {
        existingEffect.stackCount = Math.min(
          (existingEffect.stackCount || 1) + 1,
          effect.maxStacks
        );
        existingEffect.duration = Math.max(existingEffect.duration, effect.duration);
        if (effect.damage) {
          existingEffect.damage = effect.damage * (existingEffect.stackCount || 1);
        }
      } else {
        // Renova a duração
        existingEffect.duration = Math.max(existingEffect.duration, effect.duration);
      }
    } else {
      // Adiciona novo efeito
      entityEffects.push({ ...effect, stackCount: effect.stackCount || 1 });
    }
  }

  // Atualiza todos os efeitos
  update(deltaTime: number): Map<string, { damage: number; slowMultiplier: number; stunned: boolean }> {
    const results = new Map<string, { damage: number; slowMultiplier: number; stunned: boolean }>();

    this.effects.forEach((effects, entityId) => {
      let totalDamage = 0;
      let slowMultiplier = 1;
      let stunned = false;

      // Atualiza cada efeito
      for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        effect.duration -= deltaTime;

        // Aplica efeitos
        if (effect.damage) {
          totalDamage += effect.damage * deltaTime;
        }

        if (effect.slowAmount) {
          slowMultiplier *= (1 - effect.slowAmount);
        }

        if (effect.type === StatusEffectType.STUN) {
          stunned = true;
        }

        // Remove efeitos expirados
        if (effect.duration <= 0) {
          effects.splice(i, 1);
        }
      }

      // Remove entidade se não tem mais efeitos
      if (effects.length === 0) {
        this.effects.delete(entityId);
      } else {
        results.set(entityId, { damage: totalDamage, slowMultiplier, stunned });
      }
    });

    return results;
  }

  // Retorna os efeitos ativos de uma entidade
  getEffects(entityId: string): StatusEffect[] {
    return this.effects.get(entityId) || [];
  }

  // Remove todos os efeitos de uma entidade
  clearEffects(entityId: string) {
    this.effects.delete(entityId);
  }

  // Remove todos os efeitos
  clearAll() {
    this.effects.clear();
  }
}
