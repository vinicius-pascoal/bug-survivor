import { BaseWeapon, WeaponAttackResult } from './BaseWeapon';

// Espada básica - ataque corpo a corpo em arco
export class SwordWeapon extends BaseWeapon {
  private swingAngle: number = 0;
  private isSwinging: boolean = false;
  private swingSpeed: number = 10;

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>
  ): WeaponAttackResult {
    this.isSwinging = true;
    this.swingAngle = 0;

    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: any; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    // Ataque em arco frontal (120 graus)
    const range = this.weaponInstance.data.stats.range;
    const arcAngle = Math.PI * 0.66; // 120 graus

    enemies.forEach(enemy => {
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Verifica se está no alcance e no arco de ataque
      if (distance <= range + enemy.width / 2) {
        // Verifica ângulo (assumindo que o jogador ataca para frente, ângulo 0)
        const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (normalizedAngle < arcAngle / 2 || normalizedAngle > Math.PI * 2 - arcAngle / 2) {
          const damage = this.calculateDamage();
          totalDamage += damage;
          hitEnemies.push(enemy.id);

          // Efeito de impacto
          this.particleSystem.createSparks(enemy.x, enemy.y, 5, '#fbbf24');
        }
      }
    });

    return { damage: totalDamage, hitEnemies, effects, particleEffects };
  }

  render(ctx: CanvasRenderingContext2D, playerX: number, playerY: number): void {
    if (!this.isSwinging) return;

    const range = this.weaponInstance.data.stats.range;

    ctx.save();
    ctx.translate(playerX, playerY);

    // Desenha arco de ataque
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, range, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();

    ctx.restore();

    this.swingAngle += this.swingSpeed;
    if (this.swingAngle >= 60) {
      this.isSwinging = false;
    }
  }
}

// Adaga vampírica - rápida com lifesteal
export class VampiricDaggerWeapon extends BaseWeapon {
  private animationTimer: number = 0;

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>
  ): WeaponAttackResult {
    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: any; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    // Ataca o inimigo mais próximo
    const nearest = this.findNearestEnemy(playerX, playerY, enemies);

    if (nearest && nearest.distance <= this.weaponInstance.data.stats.range) {
      const damage = this.calculateDamage();
      totalDamage += damage;
      hitEnemies.push(nearest.id);

      // Efeito de sangue
      this.applyBleed(nearest.id, nearest.x, nearest.y);

      // Lifesteal visual
      this.particleSystem.createTrail(nearest.x, nearest.y, '#ef4444', 5);

      // Linha de lifesteal do inimigo ao jogador
      const steps = 10;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const x = nearest.x + (playerX - nearest.x) * t;
        const y = nearest.y + (playerY - nearest.y) * t;
        setTimeout(() => {
          this.particleSystem.createTrail(x, y, '#ef4444', 3);
        }, i * 20);
      }
    }

    return { damage: totalDamage, hitEnemies, effects, particleEffects };
  }

  render(ctx: CanvasRenderingContext2D, playerX: number, playerY: number): void {
    this.animationTimer += 0.1;
    const offset = Math.sin(this.animationTimer) * 5;

    ctx.save();
    ctx.fillStyle = '#dc2626';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';

    // Desenha adaga simples
    ctx.fillRect(playerX + offset, playerY - 10, 3, 20);

    ctx.restore();
  }
}

// Espadão - lento mas com área grande
export class GreatswordWeapon extends BaseWeapon {
  private chargeTime: number = 0;
  private isCharging: boolean = false;

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>
  ): WeaponAttackResult {
    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: any; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    const areaRadius = this.weaponInstance.data.stats.areaOfEffect || 80;

    // Ataque em área circular frontal
    const enemiesInArea = this.findEnemiesInRadius(
      playerX,
      playerY + areaRadius / 2,
      areaRadius,
      enemies
    );

    enemiesInArea.forEach(enemy => {
      const damage = this.calculateDamage();
      totalDamage += damage;
      hitEnemies.push(enemy.id);

      // Empurra inimigos (knockback)
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const angle = Math.atan2(dy, dx);

      // Efeito de impacto pesado
      this.particleSystem.createExplosion(enemy.x, enemy.y, 12, '#f59e0b', 150, 5);
      this.particleSystem.createSparks(enemy.x, enemy.y, 8, '#fbbf24');
    });

    // Onda de choque visual
    this.particleSystem.createCircle(playerX, playerY + areaRadius / 2, areaRadius, '#f59e0b', 30);

    return { damage: totalDamage, hitEnemies, effects, particleEffects };
  }

  render(ctx: CanvasRenderingContext2D, playerX: number, playerY: number): void {
    const cooldownProgress = this.getCooldownProgress();

    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.3 + cooldownProgress * 0.4;

    // Desenha indicador de área
    const areaRadius = this.weaponInstance.data.stats.areaOfEffect || 80;
    ctx.beginPath();
    ctx.arc(playerX, playerY + areaRadius / 2, areaRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

// Espada flamejante - causa queimadura e deixa rastro de fogo
export class FlameSwordWeapon extends BaseWeapon {
  private fireTrail: Array<{ x: number; y: number; life: number }> = [];

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>
  ): WeaponAttackResult {
    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: any; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    // Ataque frontal com fogo
    const range = this.weaponInstance.data.stats.range;

    enemies.forEach(enemy => {
      if (this.isInRange(enemy.x, enemy.y, playerX, playerY, range)) {
        const damage = this.calculateDamage();
        totalDamage += damage;
        hitEnemies.push(enemy.id);

        // Aplica queimadura
        this.applyBurn(enemy.id, enemy.x, enemy.y);

        // Efeito de fogo
        this.particleSystem.createFireEffect(enemy.x, enemy.y);
      }
    });

    // Cria rastro de fogo
    this.fireTrail.push({ x: playerX, y: playerY, life: 2 });

    return { damage: totalDamage, hitEnemies, effects, particleEffects };
  }

  update(deltaTime: number, playerX: number, playerY: number, enemies: any[]): WeaponAttackResult | null {
    // Atualiza rastro de fogo
    for (let i = this.fireTrail.length - 1; i >= 0; i--) {
      this.fireTrail[i].life -= deltaTime;

      // Cria partículas de fogo no rastro
      if (Math.random() < 0.3) {
        this.particleSystem.createFireEffect(this.fireTrail[i].x, this.fireTrail[i].y);
      }

      if (this.fireTrail[i].life <= 0) {
        this.fireTrail.splice(i, 1);
      }
    }

    return super.update(deltaTime, playerX, playerY, enemies);
  }

  render(ctx: CanvasRenderingContext2D, playerX: number, playerY: number): void {
    // Desenha rastro de fogo
    ctx.save();

    this.fireTrail.forEach((point, index) => {
      const alpha = point.life / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
      ctx.fill();
    });

    // Efeito de fogo ao redor do jogador
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f59e0b';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(playerX, playerY, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

// Perfurador - atravessa inimigos
export class PiercerWeapon extends BaseWeapon {
  private projectiles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    pierced: Set<string>;
  }> = [];

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>
  ): WeaponAttackResult {
    // Encontra inimigo mais próximo para mirar
    const nearest = this.findNearestEnemy(playerX, playerY, enemies);

    if (nearest) {
      const dx = nearest.x - playerX;
      const dy = nearest.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 400;

      this.projectiles.push({
        x: playerX,
        y: playerY,
        vx: (dx / distance) * speed,
        vy: (dy / distance) * speed,
        life: 2,
        pierced: new Set(),
      });
    }

    return { damage: 0, hitEnemies: [], effects: [], particleEffects: [] };
  }

  update(deltaTime: number, playerX: number, playerY: number, enemies: any[]): WeaponAttackResult | null {
    const hitEnemies: string[] = [];
    let totalDamage = 0;

    // Atualiza projéteis
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx * deltaTime;
      proj.y += proj.vy * deltaTime;
      proj.life -= deltaTime;

      // Verifica colisões
      enemies.forEach((enemy: any) => {
        if (proj.pierced.has(enemy.id)) return;

        const distance = Math.sqrt(
          Math.pow(enemy.x - proj.x, 2) + Math.pow(enemy.y - proj.y, 2)
        );

        if (distance < enemy.width / 2 + 10) {
          const damage = this.calculateDamage() * (1 + proj.pierced.size * 0.25);
          totalDamage += damage;
          hitEnemies.push(enemy.id);
          proj.pierced.add(enemy.id);

          // Efeito de perfuração
          this.particleSystem.createSparks(enemy.x, enemy.y, 8, '#3b82f6');
          this.particleSystem.createIceEffect(enemy.x, enemy.y);
        }
      });

      // Cria trail
      this.particleSystem.createTrail(proj.x, proj.y, '#3b82f6', 4);

      // Remove projéteis expirados
      if (proj.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }

    const baseResult = super.update(deltaTime, playerX, playerY, enemies);

    if (hitEnemies.length > 0) {
      return {
        damage: totalDamage,
        hitEnemies,
        effects: [],
        particleEffects: [],
      };
    }

    return baseResult;
  }

  render(ctx: CanvasRenderingContext2D, playerX: number, playerY: number): void {
    ctx.save();

    this.projectiles.forEach(proj => {
      // Desenha projétil
      ctx.fillStyle = '#3b82f6';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#3b82f6';

      const angle = Math.atan2(proj.vy, proj.vx);
      ctx.translate(proj.x, proj.y);
      ctx.rotate(angle);

      // Lança
      ctx.fillRect(-15, -3, 30, 6);

      // Ponta
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(25, -5);
      ctx.lineTo(25, 5);
      ctx.closePath();
      ctx.fill();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    ctx.restore();
  }
}
