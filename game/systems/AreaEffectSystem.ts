import { AreaEffect, AreaEffectConfig, AreaEffectType } from '../types/AreaEffectTypes';
import { generateId } from '@/utils/helpers';

export class AreaEffectSystem {
  private activeEffects: AreaEffect[] = [];
  private cooldowns: Map<string, number> = new Map();
  private configs: Map<string, AreaEffectConfig> = new Map();
  private frameCache: Map<string, HTMLImageElement[]> = new Map();

  constructor() {
    this.initializeConfigs();
  }

  private initializeConfigs() {
    // Tempestade - Raios aleatórios
    this.configs.set('lightning', {
      id: 'lightning',
      name: 'Tempestade de Raios',
      description: 'Raios caem aleatoriamente no mapa',
      baseDamage: 50,
      radius: 60,
      cooldown: 8,
      level: 1,
      currentLevel: 0,
      cost: 3,
      prerequisites: [],
      animationPath: '/efeitos/tempestade/raio_var_1',
      frameCount: 5,
      frameDuration: 0.08,
    });

    // Fogo
    this.configs.set('fire', {
      id: 'fire',
      name: 'Chuva de Fogo',
      description: 'Explosões de fogo caem no mapa',
      baseDamage: 45,
      radius: 70,
      cooldown: 7,
      level: 1,
      currentLevel: 0,
      cost: 3,
      prerequisites: ['lightning'],
      animationPath: '/efeitos/fire',
      frameCount: 5,
      frameDuration: 0.08,
    });

    // Explosão Atômica
    this.configs.set('atomic', {
      id: 'atomic',
      name: 'Explosão Atômica',
      description: 'Explosões nucleares em área',
      baseDamage: 80,
      radius: 90,
      cooldown: 12,
      level: 1,
      currentLevel: 0,
      cost: 4,
      prerequisites: ['lightning', 'fire'],
      animationPath: '/efeitos/Explosion_atomic',
      frameCount: 5,
      frameDuration: 0.1,
    });

    // Tóxico
    this.configs.set('toxic', {
      id: 'toxic',
      name: 'Gás Tóxico',
      description: 'Nuvem tóxica explode no mapa',
      baseDamage: 40,
      radius: 80,
      cooldown: 6,
      level: 1,
      currentLevel: 0,
      cost: 3,
      prerequisites: ['lightning'],
      animationPath: '/efeitos/Explosion_toxic',
      frameCount: 5,
      frameDuration: 0.08,
    });

    // Elétrico
    this.configs.set('electric', {
      id: 'electric',
      name: 'Explosão Elétrica',
      description: 'Descargas elétricas no mapa',
      baseDamage: 55,
      radius: 65,
      cooldown: 7,
      level: 1,
      currentLevel: 0,
      cost: 3,
      prerequisites: ['lightning'],
      animationPath: '/efeitos/Explosion_eletric',
      frameCount: 5,
      frameDuration: 0.08,
    });

    // Água e Fogo
    this.configs.set('water-fire', {
      id: 'water-fire',
      name: 'Inferno Aquático',
      description: 'Combinação de água e fogo no mapa',
      baseDamage: 60,
      radius: 75,
      cooldown: 9,
      level: 1,
      currentLevel: 0,
      cost: 4,
      prerequisites: ['fire', 'toxic'],
      animationPath: '/efeitos/Explosion_wather_and_fire',
      frameCount: 5,
      frameDuration: 0.08,
    });

    // Explosão Padrão
    this.configs.set('default', {
      id: 'default',
      name: 'Explosão Padrão',
      description: 'Explosão básica no mapa',
      baseDamage: 35,
      radius: 50,
      cooldown: 5,
      level: 1,
      currentLevel: 0,
      cost: 2,
      prerequisites: [],
      animationPath: '/efeitos/Explosion_defaut',
      frameCount: 5,
      frameDuration: 0.08,
    });
  }

  getConfig(effectType: AreaEffectType): AreaEffectConfig | null {
    return this.configs.get(effectType) || null;
  }

  getAllConfigs(): AreaEffectConfig[] {
    return Array.from(this.configs.values());
  }

  triggerEffect(
    effectType: AreaEffectType,
    x: number,
    y: number,
    damageMultiplier: number = 1
  ): boolean {
    const config = this.configs.get(effectType);
    if (!config) return false;

    // Verificar cooldown
    const lastUsed = this.cooldowns.get(effectType) || 0;
    const now = Date.now() / 1000;
    if (now - lastUsed < config.cooldown) {
      return false;
    }

    this.cooldowns.set(effectType, now);

    const effect: AreaEffect = {
      id: generateId(),
      x,
      y,
      damage: config.baseDamage * damageMultiplier,
      radius: config.radius,
      currentFrame: 0,
      totalFrames: config.frameCount,
      frameDuration: config.frameDuration,
      elapsedTime: 0,
      active: true,
    };

    this.activeEffects.push(effect);
    return true;
  }

  triggerRandomEffect(
    effectType: AreaEffectType,
    canvasWidth: number,
    canvasHeight: number,
    damageMultiplier: number = 1
  ): boolean {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    return this.triggerEffect(effectType, x, y, damageMultiplier);
  }

  update(deltaTime: number) {
    this.activeEffects.forEach(effect => {
      effect.elapsedTime += deltaTime;
      effect.currentFrame = Math.floor(effect.elapsedTime / effect.frameDuration);

      if (effect.currentFrame >= effect.totalFrames) {
        effect.active = false;
      }
    });

    this.activeEffects = this.activeEffects.filter(e => e.active);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.activeEffects.forEach(effect => {
      if (!effect.active) return;

      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  getActiveEffects(): AreaEffect[] {
    return this.activeEffects;
  }

  getEffectsCooldown(effectType: AreaEffectType): number {
    const config = this.configs.get(effectType);
    if (!config) return 0;

    const lastUsed = this.cooldowns.get(effectType) || 0;
    const now = Date.now() / 1000;
    const remaining = Math.max(0, config.cooldown - (now - lastUsed));
    return remaining;
  }

  upgradeEffect(effectType: AreaEffectType): boolean {
    const config = this.configs.get(effectType);
    if (!config || config.currentLevel >= config.level) {
      return false;
    }

    config.currentLevel++;
    config.baseDamage *= 1.2; // 20% mais dano
    config.radius *= 1.1; // 10% mais raio
    config.cooldown *= 0.9; // 10% menos cooldown

    return true;
  }

  activateEffect(effectType: AreaEffectType): void {
    const config = this.configs.get(effectType);
    if (config) {
      config.currentLevel = 1; // Ativa o efeito
    }
  }

  isEffectActive(effectType: AreaEffectType): boolean {
    const config = this.configs.get(effectType);
    return config ? config.currentLevel > 0 : false;
  }

  getActiveEffectTypes(): AreaEffectType[] {
    return Array.from(this.configs.values())
      .filter(config => config.currentLevel > 0)
      .map(config => config.id as AreaEffectType);
  }

  reset() {
    this.activeEffects = [];
    this.cooldowns.clear();
    this.frameCache.clear();
  }
}
