import { BaseWeapon, WeaponAttackResult, StatusEffectType } from './BaseWeapon';

// Espada básica - ataque corpo a corpo em arco
export class SwordWeapon extends BaseWeapon {
  private swingAngle: number = 0;
  private isSwinging: boolean = false;
  private swingSpeed: number = 10;
  private lastPlayerAngle: number = 0;

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>,
    playerAngle: number = 0
  ): WeaponAttackResult {
    this.isSwinging = true;
    this.swingAngle = 0;
    this.lastPlayerAngle = playerAngle;

    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: StatusEffectType; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    // Ataque em arco frontal (120 graus) na direção que o jogador está olhando
    const range = this.weaponInstance.data.stats.range;
    const arcAngle = Math.PI * 0.66; // 120 graus

    enemies.forEach(enemy => {
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const enemyAngle = Math.atan2(dy, dx);

      // Verifica se está no alcance e no arco de ataque baseado na direção do jogador
      if (distance <= range + enemy.width / 2) {
        // Calcula a diferença angular entre a direção do jogador e a posição do inimigo
        let angleDiff = enemyAngle - playerAngle;
        // Normaliza para -PI a PI
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Verifica se está dentro do arco de ataque
        if (Math.abs(angleDiff) <= arcAngle / 2) {
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
    ctx.rotate(this.lastPlayerAngle);

    // Desenha arco de ataque na direção do jogador
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
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>,
    playerAngle: number = 0
  ): WeaponAttackResult {
    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: StatusEffectType; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    // Ataca inimigos na direção que o jogador está olhando
    const range = this.weaponInstance.data.stats.range;
    const arcAngle = Math.PI / 2; // 90 graus - mais focado que a espada

    enemies.forEach(enemy => {
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const enemyAngle = Math.atan2(dy, dx);

      if (distance <= range) {
        // Calcula a diferença angular
        let angleDiff = enemyAngle - playerAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Ataca apenas inimigos na frente
        if (Math.abs(angleDiff) <= arcAngle / 2) {
          const damage = this.calculateDamage();
          totalDamage += damage;
          hitEnemies.push(enemy.id);

          // Efeito de sangue
          this.applyBleed(enemy.id, enemy.x, enemy.y);

          // Lifesteal visual
          this.particleSystem.createBloodEffect(enemy.x, enemy.y);
        }
      }
    });

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
  private lastPlayerAngle: number = 0;

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>,
    playerAngle: number = 0
  ): WeaponAttackResult {
    this.lastPlayerAngle = playerAngle;
    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: StatusEffectType; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    const range = this.weaponInstance.data.stats.range;
    const areaRadius = this.weaponInstance.data.stats.areaOfEffect || 80;
    const arcAngle = Math.PI; // 180 graus - ataque amplo

    // Ataque em arco amplo na direção que o jogador está olhando
    enemies.forEach(enemy => {
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const enemyAngle = Math.atan2(dy, dx);

      if (distance <= range + areaRadius / 2) {
        // Calcula a diferença angular
        let angleDiff = enemyAngle - playerAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Verifica se está dentro do arco de ataque amplo
        if (Math.abs(angleDiff) <= arcAngle / 2) {
          const damage = this.calculateDamage();
          totalDamage += damage;
          hitEnemies.push(enemy.id);

          // Efeito de impacto pesado
          this.particleSystem.createExplosion(enemy.x, enemy.y, 10, '#fb923c');
        }
      }
    });

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
  private lastPlayerAngle: number = 0;

  attack(
    playerX: number,
    playerY: number,
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>,
    playerAngle: number = 0
  ): WeaponAttackResult {
    this.lastPlayerAngle = playerAngle;
    const hitEnemies: string[] = [];
    const effects: Array<{ enemyId: string; effectType: StatusEffectType; duration: number }> = [];
    const particleEffects: Array<{ x: number; y: number; type: string }> = [];
    let totalDamage = 0;

    const range = this.weaponInstance.data.stats.range;
    const arcAngle = Math.PI * 0.8; // 144 graus

    enemies.forEach(enemy => {
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const enemyAngle = Math.atan2(dy, dx);

      if (distance <= range) {
        let angleDiff = enemyAngle - playerAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        if (Math.abs(angleDiff) <= arcAngle / 2) {
          const damage = this.calculateDamage();
          totalDamage += damage;
          hitEnemies.push(enemy.id);

          // Aplica queimadura
          this.applyBurn(enemy.id, enemy.x, enemy.y);
          this.particleSystem.createFireEffect(enemy.x, enemy.y);
        }
      }
    });

    return { damage: totalDamage, hitEnemies, effects, particleEffects };
  }

  update(deltaTime: number, playerX: number, playerY: number, enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>, playerAngle: number = 0): WeaponAttackResult | null {
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

    return super.update(deltaTime, playerX, playerY, enemies, playerAngle);
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
    enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>,
    playerAngle: number = 0
  ): WeaponAttackResult {
    // Dispara na direção que o jogador está olhando
    const speed = 400;

    this.projectiles.push({
      x: playerX,
      y: playerY,
      vx: Math.cos(playerAngle) * speed,
      vy: Math.sin(playerAngle) * speed,
      life: 2,
      pierced: new Set(),
    });

    return { damage: 0, hitEnemies: [], effects: [], particleEffects: [] };
  }

  update(deltaTime: number, playerX: number, playerY: number, enemies: Array<{ id: string; x: number; y: number; width: number; height: number }>, playerAngle: number = 0): WeaponAttackResult | null {
    const hitEnemies: string[] = [];
    let totalDamage = 0;

    // Atualiza projéteis
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx * deltaTime;
      proj.y += proj.vy * deltaTime;
      proj.life -= deltaTime;

      // Verifica colisões
      enemies.forEach((enemy: { id: string; x: number; y: number; width: number; height: number }) => {
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

    const baseResult = super.update(deltaTime, playerX, playerY, enemies, playerAngle);

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
