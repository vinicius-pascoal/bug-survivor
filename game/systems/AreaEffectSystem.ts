import { AreaEffect, AreaEffectConfig, AreaEffectType } from '../types/AreaEffectTypes';
import { generateId } from '@/utils/helpers';

interface AnimatedAreaEffect extends AreaEffect {
  effectType: AreaEffectType;
  rotation?: number;
  scale?: number;
}

export class AreaEffectSystem {
  private activeEffects: AnimatedAreaEffect[] = [];
  private cooldowns: Map<string, number> = new Map();
  private configs: Map<string, AreaEffectConfig> = new Map();
  private frameCache: Map<string, HTMLImageElement[]> = new Map();
  private isLoadingFrames: Map<string, boolean> = new Map();

  constructor() {
    this.initializeConfigs();
    this.preloadAllAnimations();
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
      frameDuration: 0.1,
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
      frameCount: 6,
      frameDuration: 0.1,
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
      frameCount: 10,
      frameDuration: 0.08,
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
      frameCount: 10,
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
      frameCount: 10,
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
      frameCount: 10,
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
      frameCount: 10,
      frameDuration: 0.08,
    });
  }

  private async preloadAllAnimations() {
    for (const [type, config] of this.configs.entries()) {
      await this.loadAnimationFrames(type as AreaEffectType, config);
    }
  }

  private async loadAnimationFrames(effectType: AreaEffectType, config: AreaEffectConfig): Promise<void> {
    if (this.frameCache.has(effectType) || this.isLoadingFrames.get(effectType)) {
      return;
    }

    this.isLoadingFrames.set(effectType, true);
    const frames: HTMLImageElement[] = [];

    try {
      // Padrões especiais para raios
      if (effectType === 'lightning') {
        // Escolher variante aleatória de raio
        const variant = Math.floor(Math.random() * 3) + 1; // 1, 2 ou 3
        const path = `/efeitos/tempestade/raio_var_${variant}`;

        if (variant === 1) {
          // raio_var_1: Explosion_1.png até Explosion_5.png
          for (let i = 1; i <= 5; i++) {
            const img = await this.loadImage(`${path}/Explosion_${i}.png`);
            if (img) frames.push(img);
          }
        } else if (variant === 2) {
          // raio_var_2: Explosion_1_1.png, Explosion_1_2.png, Explosion_1_3.png
          for (let i = 1; i <= 3; i++) {
            const img = await this.loadImage(`${path}/Explosion_1_${i}.png`);
            if (img) frames.push(img);
          }
        } else {
          // raio_var_3: Explosion_2_1.png até Explosion_2_6.png
          for (let i = 1; i <= 6; i++) {
            const img = await this.loadImage(`${path}/Explosion_2_${i}.png`);
            if (img) frames.push(img);
          }
        }
      } else {
        // Padrão normal para outros efeitos
        for (let i = 1; i <= config.frameCount; i++) {
          const img = await this.loadImage(`${config.animationPath}/Explosion_${i}.png`);
          if (img) frames.push(img);
        }
      }

      if (frames.length > 0) {
        this.frameCache.set(effectType, frames);
      }
    } catch (error) {
      console.error(`Error loading animation for ${effectType}:`, error);
    } finally {
      this.isLoadingFrames.set(effectType, false);
    }
  }

  private async loadImage(path: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load frame: ${path}`);
        resolve(null);
      };
      img.src = path;
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

    // Carregar animação se ainda não estiver carregada
    if (!this.frameCache.has(effectType)) {
      this.loadAnimationFrames(effectType, config);
    }

    const effect: AnimatedAreaEffect = {
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
      effectType,
      rotation: Math.random() * Math.PI * 2, // Rotação aleatória
      scale: 0.8 + Math.random() * 0.4, // Escala entre 0.8 e 1.2
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

      const frames = this.frameCache.get(effect.effectType);

      if (frames && frames.length > 0) {
        // Renderizar sprite animado
        const frameIndex = Math.min(effect.currentFrame, frames.length - 1);
        const currentImage = frames[frameIndex];

        if (currentImage && currentImage.complete && currentImage.naturalWidth > 0) {
          ctx.save();

          // Calcular tamanho baseado no raio do efeito e escala
          const baseSize = effect.radius * 3;
          const size = baseSize * (effect.scale || 1);

          // Adicionar glow effect baseado no tipo
          const glowColors: Record<AreaEffectType, string> = {
            lightning: '#4488ff',
            fire: '#ff6600',
            atomic: '#00ff00',
            toxic: '#88ff00',
            electric: '#ffff00',
            'water-fire': '#00ccff',
            default: '#ff8800',
          };

          const glowColor = glowColors[effect.effectType] || glowColors.default;

          // Aplicar glow
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 20;

          // Centralizar a imagem no ponto de efeito
          ctx.translate(effect.x, effect.y);

          // Aplicar rotação se definida
          if (effect.rotation) {
            ctx.rotate(effect.rotation);
          }

          // Fade out nos últimos frames
          const fadeProgress = effect.currentFrame / effect.totalFrames;
          ctx.globalAlpha = fadeProgress < 0.7 ? 1.0 : 1.0 - ((fadeProgress - 0.7) / 0.3) * 0.5;

          // Desenhar a sprite
          ctx.drawImage(
            currentImage,
            -size / 2,
            -size / 2,
            size,
            size
          );

          ctx.restore();
        } else {
          // Fallback: círculo colorido se a imagem não carregar
          this.renderFallbackEffect(ctx, effect);
        }
      } else {
        // Fallback: círculo colorido se não houver frames
        this.renderFallbackEffect(ctx, effect);
      }
    });
  }

  private renderFallbackEffect(ctx: CanvasRenderingContext2D, effect: AnimatedAreaEffect) {
    // Definir cores por tipo de efeito
    const colors: Record<AreaEffectType, string> = {
      lightning: 'rgba(100, 150, 255, 0.5)',
      fire: 'rgba(255, 100, 0, 0.5)',
      atomic: 'rgba(0, 255, 0, 0.5)',
      toxic: 'rgba(150, 255, 0, 0.5)',
      electric: 'rgba(255, 255, 0, 0.5)',
      'water-fire': 'rgba(0, 200, 255, 0.5)',
      default: 'rgba(255, 0, 0, 0.3)',
    };

    ctx.save();
    ctx.globalAlpha = 0.7 - (effect.currentFrame / effect.totalFrames) * 0.4;
    ctx.fillStyle = colors[effect.effectType] || colors.default;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
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
    console.log('[AreaEffectSystem] Tentando ativar efeito:', effectType);
    const config = this.configs.get(effectType);
    if (config) {
      config.currentLevel = 1; // Ativa o efeito
      console.log('[AreaEffectSystem] Efeito ativado:', effectType, 'Nível:', config.currentLevel);
    } else {
      console.error('[AreaEffectSystem] Config não encontrado para:', effectType);
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
