import { GAME_CONFIG } from '../config/gameConfig';
import { randomRange } from '@/utils/math';

export interface EnemyState {
  id: string;
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
}

export class Enemy {
  private state: EnemyState;

  constructor(id: string, x: number, y: number) {
    const speed = randomRange(GAME_CONFIG.enemies.minSpeed, GAME_CONFIG.enemies.maxSpeed);

    this.state = {
      id,
      x,
      y,
      width: GAME_CONFIG.enemies.baseSize,
      height: GAME_CONFIG.enemies.baseSize,
      speed,
      health: 20,
      maxHealth: 20,
      damage: 10,
      xpValue: 10,
      active: true,
    };
  }

  update(deltaTime: number, targetX: number, targetY: number) {
    if (!this.state.active) return;

    // Move towards target (player)
    const dx = targetX - this.state.x;
    const dy = targetY - this.state.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      this.state.x += (dx / distance) * this.state.speed * deltaTime;
      this.state.y += (dy / distance) * this.state.speed * deltaTime;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.state.active) return;

    ctx.save();

    // Draw glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';

    // Draw enemy body
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      this.state.x - this.state.width / 2,
      this.state.y - this.state.height / 2,
      this.state.width,
      this.state.height
    );

    // Draw health bar if damaged
    if (this.state.health < this.state.maxHealth) {
      const barWidth = this.state.width;
      const barHeight = 3;
      const healthPercent = this.state.health / this.state.maxHealth;

      // Background
      ctx.fillStyle = '#333';
      ctx.fillRect(
        this.state.x - barWidth / 2,
        this.state.y - this.state.height / 2 - 8,
        barWidth,
        barHeight
      );

      // Health
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(
        this.state.x - barWidth / 2,
        this.state.y - this.state.height / 2 - 8,
        barWidth * healthPercent,
        barHeight
      );
    }

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
