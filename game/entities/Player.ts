import { GAME_CONFIG } from '../config/gameConfig';

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
  }

  update(deltaTime: number, input: { x: number; y: number }) {
    // Update position based on input
    this.state.x += input.x * this.state.speed * deltaTime;
    this.state.y += input.y * this.state.speed * deltaTime;

    // Keep player in bounds (will be clamped by systems)
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw player (temporary visual - will be replaced with sprites)
    ctx.save();

    // Draw glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#06b6d4';

    // Draw player body
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(
      this.state.x - this.state.width / 2,
      this.state.y - this.state.height / 2,
      this.state.width,
      this.state.height
    );

    // Draw center dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.state.x, this.state.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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
  }

  heal(amount: number) {
    this.state.health = Math.min(this.state.maxHealth, this.state.health + amount);
  }

  increaseMaxHealth(amount: number) {
    this.state.maxHealth += amount;
  }
}
