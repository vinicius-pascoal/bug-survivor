// Sistema de partículas para efeitos visuais
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: 'circle' | 'square' | 'trail' | 'spark';
  rotation?: number;
  rotationSpeed?: number;
  gravity?: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private nextId = 0;

  // Cria uma explosão de partículas
  createExplosion(
    x: number,
    y: number,
    count: number,
    color: string,
    speed: number = 150,
    size: number = 4
  ) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const particleSpeed = speed * (0.5 + Math.random() * 0.5);

      this.particles.push({
        id: `particle_${this.nextId++}`,
        x,
        y,
        vx: Math.cos(angle) * particleSpeed,
        vy: Math.sin(angle) * particleSpeed,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1,
        size: size * (0.5 + Math.random() * 0.5),
        color,
        alpha: 1,
        type: 'circle',
        gravity: 100,
      });
    }
  }

  // Cria um trail (rastro)
  createTrail(x: number, y: number, color: string, size: number = 3) {
    this.particles.push({
      id: `particle_${this.nextId++}`,
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0.3,
      maxLife: 0.3,
      size,
      color,
      alpha: 0.8,
      type: 'trail',
    });
  }

  // Cria faíscas
  createSparks(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;

      this.particles.push({
        id: `particle_${this.nextId++}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.2 + Math.random() * 0.3,
        maxLife: 0.5,
        size: 2 + Math.random() * 2,
        color,
        alpha: 1,
        type: 'spark',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 200,
      });
    }
  }

  // Cria um círculo de partículas
  createCircle(x: number, y: number, radius: number, color: string, particleCount: number = 20) {
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      this.particles.push({
        id: `particle_${this.nextId++}`,
        x: px,
        y: py,
        vx: 0,
        vy: 0,
        life: 0.5,
        maxLife: 0.5,
        size: 3,
        color,
        alpha: 0.8,
        type: 'circle',
      });
    }
  }

  // Cria efeito de sangramento
  createBloodEffect(x: number, y: number) {
    this.createExplosion(x, y, 8, '#ef4444', 80, 3);
  }

  // Cria efeito de fogo
  createFireEffect(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 30;

      this.particles.push({
        id: `particle_${this.nextId++}`,
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 0.3 + Math.random() * 0.4,
        maxLife: 0.7,
        size: 4 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
        alpha: 1,
        type: 'circle',
      });
    }
  }

  // Cria efeito de gelo
  createIceEffect(x: number, y: number) {
    this.createExplosion(x, y, 12, '#3b82f6', 100, 3);
    this.createSparks(x, y, 5, '#93c5fd');
  }

  // Atualiza todas as partículas
  update(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      // Atualiza posição
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Aplica gravidade
      if (particle.gravity) {
        particle.vy += particle.gravity * deltaTime;
      }

      // Atualiza rotação
      if (particle.rotation !== undefined && particle.rotationSpeed) {
        particle.rotation += particle.rotationSpeed * deltaTime;
      }

      // Atualiza vida
      particle.life -= deltaTime;
      particle.alpha = particle.life / particle.maxLife;

      // Remove partículas mortas
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Renderiza todas as partículas
  render(ctx: CanvasRenderingContext2D, cameraX: number = 0, cameraY: number = 0) {
    this.particles.forEach(particle => {
      const screenX = particle.x - cameraX;
      const screenY = particle.y - cameraY;

      ctx.save();
      ctx.globalAlpha = particle.alpha;

      if (particle.type === 'circle' || particle.type === 'trail') {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.type === 'square') {
        ctx.fillStyle = particle.color;
        ctx.translate(screenX, screenY);
        if (particle.rotation) ctx.rotate(particle.rotation);
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      } else if (particle.type === 'spark') {
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size;
        ctx.lineCap = 'round';
        ctx.translate(screenX, screenY);
        if (particle.rotation) ctx.rotate(particle.rotation);
        ctx.beginPath();
        ctx.moveTo(-particle.size * 2, 0);
        ctx.lineTo(particle.size * 2, 0);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  // Limpa todas as partículas
  clear() {
    this.particles = [];
  }

  // Retorna o número de partículas ativas
  getCount(): number {
    return this.particles.length;
  }
}
