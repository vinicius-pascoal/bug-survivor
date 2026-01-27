import { EnemyDefinition, EnemyProjectile } from '../types/EnemyTypes';
import { generateId } from '@/utils/helpers';

export interface EnemyState {
  id: string;
  definitionId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  xpValue: number;
  active: boolean;
  combatStyle: EnemyDefinition['combatStyle'];
  isBoss: boolean;
  bossBarColor?: string;
}

export class Enemy {
  private state: EnemyState;
  private definition: EnemyDefinition;
  private sprite?: HTMLImageElement;
  private attackTimer: number = 0;
  private projectiles: EnemyProjectile[] = [];
  private static spriteCache: Map<string, HTMLImageElement> = new Map();

  constructor(definition: EnemyDefinition, x: number, y: number) {
    this.definition = definition;
    this.sprite = this.loadSprite(definition.sprite);

    this.state = {
      id: generateId(),
      definitionId: definition.id,
      name: definition.name,
      x,
      y,
      width: definition.width,
      height: definition.height,
      speed: definition.speed,
      health: definition.health,
      maxHealth: definition.health,
      damage: definition.damage,
      xpValue: definition.xpValue,
      active: true,
      combatStyle: definition.combatStyle,
      isBoss: Boolean(definition.isBoss),
      bossBarColor: definition.bossBarColor,
    };
  }

  private loadSprite(path: string): HTMLImageElement {
    if (Enemy.spriteCache.has(path)) {
      return Enemy.spriteCache.get(path)!;
    }

    const img = new Image();
    img.src = path;
    Enemy.spriteCache.set(path, img);
    return img;
  }

  update(deltaTime: number, targetX: number, targetY: number) {
    if (!this.state.active) return;

    this.attackTimer += deltaTime;

    const dx = targetX - this.state.x;
    const dy = targetY - this.state.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const dirX = dx / distance;
    const dirY = dy / distance;

    switch (this.state.combatStyle) {
      case 'melee': {
        this.state.x += dirX * this.state.speed * deltaTime;
        this.state.y += dirY * this.state.speed * deltaTime;
        break;
      }
      case 'ranged': {
        const preferred = this.definition.preferredDistance || 250;
        const tooClose = preferred * 0.7;

        if (distance > preferred) {
          this.state.x += dirX * this.state.speed * deltaTime;
          this.state.y += dirY * this.state.speed * deltaTime;
        } else if (distance < tooClose) {
          this.state.x -= dirX * this.state.speed * deltaTime;
          this.state.y -= dirY * this.state.speed * deltaTime;
        }

        const inRange = this.definition.range ? distance <= this.definition.range : true;
        if (inRange && this.canAttack()) {
          this.shoot(dirX, dirY);
        }
        break;
      }
      case 'boss-ranged': {
        const preferred = this.definition.preferredDistance || 340;
        const tooClose = preferred * 0.65;

        if (distance > preferred) {
          this.state.x += dirX * this.state.speed * deltaTime;
          this.state.y += dirY * this.state.speed * deltaTime;
        } else if (distance < tooClose) {
          this.state.x -= dirX * this.state.speed * deltaTime * 0.8;
          this.state.y -= dirY * this.state.speed * deltaTime * 0.8;
        }

        const inRange = this.definition.range ? distance <= this.definition.range : true;
        if (inRange && this.canAttack()) {
          // Dispara três projéteis em leque
          this.shoot(dirX, dirY);
          this.shoot(Math.cos(Math.atan2(dirY, dirX) + 0.25), Math.sin(Math.atan2(dirY, dirX) + 0.25));
          this.shoot(Math.cos(Math.atan2(dirY, dirX) - 0.25), Math.sin(Math.atan2(dirY, dirX) - 0.25));
        }
        break;
      }
      case 'boss-charger': {
        // Carrega e depois avança rapidamente
        const windup = (this.definition.attackCooldown || 2.5) * 0.6;
        if (this.attackTimer < windup) {
          // levíssima aproximação
          this.state.x += dirX * this.state.speed * deltaTime * 0.6;
          this.state.y += dirY * this.state.speed * deltaTime * 0.6;
        } else if (this.attackTimer < (this.definition.attackCooldown || 2.5)) {
          this.state.x += dirX * this.state.speed * deltaTime * 2.2;
          this.state.y += dirY * this.state.speed * deltaTime * 2.2;
        } else {
          this.attackTimer = 0;
        }
        break;
      }
      case 'boss-melee':
      default: {
        // Boss melee dá pequenos sprints
        const sprintWindow = (this.definition.attackCooldown || 2) * 0.4;
        if (this.attackTimer <= sprintWindow) {
          this.state.x += dirX * this.state.speed * deltaTime * 1.6;
          this.state.y += dirY * this.state.speed * deltaTime * 1.6;
        } else {
          this.state.x += dirX * this.state.speed * deltaTime * 0.9;
          this.state.y += dirY * this.state.speed * deltaTime * 0.9;
        }
        if (this.attackTimer >= (this.definition.attackCooldown || 2)) {
          this.attackTimer = 0;
        }
        break;
      }
    }

    this.updateProjectiles(deltaTime);
  }

  private canAttack(): boolean {
    const cooldown = this.definition.attackCooldown || 1.2;
    if (this.attackTimer >= cooldown) {
      this.attackTimer = 0;
      return true;
    }
    return false;
  }

  private shoot(dirX: number, dirY: number) {
    const speed = this.definition.projectileSpeed || 300;
    const size = this.definition.projectileSize || 6;
    this.projectiles.push({
      id: generateId(),
      x: this.state.x,
      y: this.state.y,
      vx: dirX * speed,
      vy: dirY * speed,
      radius: size,
      damage: this.state.damage,
      life: 3,
    });
  }

  private updateProjectiles(deltaTime: number) {
    this.projectiles.forEach(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.life -= deltaTime;
    });
    this.projectiles = this.projectiles.filter(p => p.life > 0);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.state.active) return;

    ctx.save();

    if (this.sprite && this.sprite.complete) {
      ctx.drawImage(
        this.sprite,
        this.state.x - this.state.width / 2,
        this.state.y - this.state.height / 2,
        this.state.width,
        this.state.height
      );
    } else {
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(
        this.state.x - this.state.width / 2,
        this.state.y - this.state.height / 2,
        this.state.width,
        this.state.height
      );
    }

    // Draw health bar if damaged or boss
    if (this.state.health < this.state.maxHealth || this.state.isBoss) {
      const barWidth = this.state.width;
      const barHeight = 5;
      const healthPercent = Math.max(0, this.state.health / this.state.maxHealth);

      ctx.fillStyle = '#111827';
      ctx.fillRect(
        this.state.x - barWidth / 2,
        this.state.y - this.state.height / 2 - 10,
        barWidth,
        barHeight
      );

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(
        this.state.x - barWidth / 2,
        this.state.y - this.state.height / 2 - 10,
        barWidth * healthPercent,
        barHeight
      );
    }

    // Render projectiles
    this.projectiles.forEach(p => {
      ctx.fillStyle = this.state.isBoss ? '#38bdf8' : '#fbbf24';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.state.isBoss ? '#38bdf8' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  takeDamage(damage: number): boolean {
    this.state.health -= damage;
    if (this.state.health <= 0) {
      this.state.active = false;
      return true; // Enemy died
    }
    return false;
  }

  getProjectiles(): EnemyProjectile[] {
    return this.projectiles;
  }

  getState(): EnemyState {
    return { ...this.state };
  }

  getBounds() {
    return {
      x: this.state.x - this.state.width / 2,
      y: this.state.y - this.state.height / 2,
      width: this.state.width,
      height: this.state.height,
    };
  }
}
