import { Projectile } from '../entities/Projectile';
import { generateId } from '@/utils/helpers';

export class DataDiskWeapon {
  private projectiles: Projectile[] = [];
  private angle: number = 0;
  private count: number;
  private radius: number;
  private damage: number;
  private rotationSpeed: number;

  constructor(count: number = 3, radius: number = 80, damage: number = 10, rotationSpeed: number = 3) {
    this.count = count;
    this.radius = radius;
    this.damage = damage;
    this.rotationSpeed = rotationSpeed;

    // Initialize projectiles
    for (let i = 0; i < count; i++) {
      this.projectiles.push(new Projectile(generateId(), 0, 0, damage));
    }
  }

  update(deltaTime: number, playerX: number, playerY: number) {
    this.angle += this.rotationSpeed * deltaTime;

    // Update projectile positions in orbit
    this.projectiles.forEach((projectile, i) => {
      const angleOffset = (Math.PI * 2 / this.count) * i;
      const x = playerX + Math.cos(this.angle + angleOffset) * this.radius;
      const y = playerY + Math.sin(this.angle + angleOffset) * this.radius;
      projectile.setPosition(x, y);
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    this.projectiles.forEach(projectile => projectile.render(ctx));
  }

  getProjectiles(): Projectile[] {
    return this.projectiles.filter(p => p.getState().active);
  }

  upgrade() {
    // Add more projectiles or increase damage
    this.addProjectile();
  }

  addProjectile() {
    // Adiciona um novo projétil
    this.count++;
    this.projectiles.push(new Projectile(generateId(), 0, 0, this.damage));
  }

  increaseDamage(amount: number) {
    this.damage += amount;
    // Aumenta o dano de todos os projéteis existentes
    this.projectiles.forEach(p => {
      p.setDamage(p.getState().damage + amount);
    });
  }

  getCount(): number {
    return this.count;
  }

  getDamage(): number {
    return this.damage;
  }
}
