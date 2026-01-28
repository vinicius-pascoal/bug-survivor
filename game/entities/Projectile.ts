export interface ProjectileState {
  id: string;
  x: number;
  y: number;
  radius: number;
  damage: number;
  active: boolean;
}

export class Projectile {
  private state: ProjectileState;

  constructor(id: string, x: number, y: number, damage: number) {
    this.state = {
      id,
      x,
      y,
      radius: 4,
      damage,
      active: true,
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.state.active) return;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#06b6d4';
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(this.state.x, this.state.y, this.state.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getState(): ProjectileState {
    return { ...this.state };
  }

  setPosition(x: number, y: number) {
    this.state.x = x;
    this.state.y = y;
  }

  setDamage(damage: number) {
    this.state.damage = damage;
  }

  deactivate() {
    this.state.active = false;
  }
}
