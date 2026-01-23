export interface XPDrop {
  id: string;
  x: number;
  y: number;
  value: number;
  active: boolean;
  magnetRadius: number;
}

export class XPDropSystem {
  private drops: XPDrop[] = [];

  createDrop(id: string, x: number, y: number, value: number) {
    this.drops.push({
      id,
      x,
      y,
      value,
      active: true,
      magnetRadius: 80,
    });
  }

  update(deltaTime: number, playerX: number, playerY: number): number {
    let collectedXP = 0;

    this.drops.forEach(drop => {
      if (!drop.active) return;

      const dx = playerX - drop.x;
      const dy = playerY - drop.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Magnet effect
      if (distance < drop.magnetRadius) {
        const speed = 300;
        drop.x += (dx / distance) * speed * deltaTime;
        drop.y += (dy / distance) * speed * deltaTime;
      }

      // Collection
      if (distance < 20) {
        collectedXP += drop.value;
        drop.active = false;
      }
    });

    // Clean up collected drops
    this.drops = this.drops.filter(drop => drop.active);

    return collectedXP;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.drops.forEach(drop => {
      if (!drop.active) return;

      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#a855f7';
      
      // Draw crystal shape
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#d946ef';
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }

  clear() {
    this.drops = [];
  }
}
