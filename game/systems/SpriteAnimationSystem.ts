export type Direction = 'north' | 'north-east' | 'east' | 'south-east' | 'south' | 'south-west' | 'west' | 'north-west';

export interface AnimationState {
  direction: Direction;
  isMoving: boolean;
}

export class SpriteAnimationSystem {
  private sprites: Map<string, HTMLImageElement> = new Map();
  private currentAnimation: string = 'idle-south';
  private animationFrame: number = 0;
  private frameTime: number = 0;
  private frameDelay: number = 0.1; // segundos por frame
  private isLoaded: boolean = false;
  private lastDirection: Direction = 'south';

  constructor() {
    this.loadSprites();
  }

  private loadSprites() {
    const animations = [
      // Idle
      { key: 'idle-south', path: '/tvheadman/a_tv_head_man_using_a_moleton_breathing-idle_south.gif' },

      // Walking - 8 direções
      { key: 'walking-north', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_north.gif' },
      { key: 'walking-north-east', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_north-east.gif' },
      { key: 'walking-east', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_east.gif' },
      { key: 'walking-south-east', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_south-east.gif' },
      { key: 'walking-south', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_south.gif' },
      { key: 'walking-south-west', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_south-west.gif' },
      { key: 'walking-west', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_west.gif' },
      { key: 'walking-north-west', path: '/tvheadman/andando/a_tv_head_man_using_a_moleton_walking-8-frames_north-west.gif' },

      // Running - 8 direções
      { key: 'running-north', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_north.gif' },
      { key: 'running-north-east', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_north-east.gif' },
      { key: 'running-east', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_east.gif' },
      { key: 'running-south-east', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_south-east.gif' },
      { key: 'running-south', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_south.gif' },
      { key: 'running-south-west', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_south-west.gif' },
      { key: 'running-west', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_west.gif' },
      { key: 'running-north-west', path: '/tvheadman/correndo/a_tv_head_man_using_a_moleton_running-6-frames_north-west.gif' },
    ];

    let loadedCount = 0;
    animations.forEach(({ key, path }) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === animations.length) {
          this.isLoaded = true;
        }
      };
      img.onerror = () => {
        console.error(`Failed to load sprite: ${path}`);
        loadedCount++;
        if (loadedCount === animations.length) {
          this.isLoaded = true;
        }
      };
      this.sprites.set(key, img);
    });
  }

  getDirection(dx: number, dy: number): Direction {
    // Normalizar para evitar problemas com valores muito pequenos
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
      return 'south'; // Direção padrão quando parado
    }

    // Calcular ângulo em radianos
    const angle = Math.atan2(dy, dx);
    // Converter para graus
    const degrees = angle * (180 / Math.PI);
    // Normalizar para 0-360
    const normalizedDegrees = (degrees + 360) % 360;

    // Determinar direção baseada no ângulo (8 direções)
    if (normalizedDegrees >= 337.5 || normalizedDegrees < 22.5) return 'east';
    if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) return 'south-east';
    if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) return 'south';
    if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) return 'south-west';
    if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) return 'west';
    if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) return 'north-west';
    if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) return 'north';
    return 'north-east';
  }

  update(deltaTime: number, input: { x: number; y: number }) {
    const isMoving = Math.abs(input.x) > 0.01 || Math.abs(input.y) > 0.01;
    const direction = isMoving ? this.getDirection(input.x, input.y) : this.lastDirection;

    if (isMoving) {
      this.lastDirection = direction;
    }

    // Determinar animação (usando walking por padrão, pode adicionar lógica para running)
    let animationType = 'idle';
    if (isMoving) {
      // Pode adicionar lógica para alternar entre walking e running
      // Por exemplo, baseado na velocidade ou tecla shift
      animationType = 'walking';
    }

    const newAnimation = isMoving ? `${animationType}-${direction}` : 'idle-south';

    // Resetar frame se mudou de animação
    if (newAnimation !== this.currentAnimation) {
      this.currentAnimation = newAnimation;
      this.animationFrame = 0;
      this.frameTime = 0;
    }

    // Atualizar frame time (apenas para controle se necessário)
    this.frameTime += deltaTime;
    if (this.frameTime >= this.frameDelay) {
      this.frameTime = 0;
      // GIFs animam sozinhos, então não precisamos controlar frames manualmente
    }
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    if (!this.isLoaded) {
      // Fallback: desenhar círculo enquanto carrega
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(x, y, width / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    const sprite = this.sprites.get(this.currentAnimation);
    if (sprite && sprite.complete) {
      ctx.save();

      // Desenhar sprite centralizado
      ctx.drawImage(
        sprite,
        x - width / 2,
        y - height / 2,
        width,
        height
      );

      ctx.restore();
    } else {
      // Fallback se sprite não carregou
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(x, y, width / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  isReady(): boolean {
    return this.isLoaded;
  }

  getCurrentDirection(): Direction {
    return this.lastDirection;
  }

  getDirectionAngle(direction?: Direction): number {
    const dir = direction || this.getCurrentDirection();
    const angleMap: Record<Direction, number> = {
      'east': 0,
      'south-east': Math.PI / 4,
      'south': Math.PI / 2,
      'south-west': (3 * Math.PI) / 4,
      'west': Math.PI,
      'north-west': (5 * Math.PI) / 4,
      'north': (3 * Math.PI) / 2,
      'north-east': (7 * Math.PI) / 4,
    };
    return angleMap[dir];
  }
}
