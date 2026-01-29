export interface MedkitState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  healPercentage: number;
}

export class Medkit {
  private state: MedkitState;
  private image: HTMLImageElement | null = null;
  private imageLoaded: boolean = false;
  private pulseTimer: number = 0;

  constructor(id: string, x: number, y: number, healPercentage: number = 0.2) {
    this.state = {
      id,
      x,
      y,
      width: 32,
      height: 32,
      active: true,
      healPercentage,
    };

    // Carregar imagem do medkit
    this.loadImage();
  }

  private loadImage() {
    this.image = new Image();
    this.image.src = '/medkit.png';
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  update(deltaTime: number) {
    if (!this.state.active) return;

    // Animação de pulso
    this.pulseTimer += deltaTime * 2;
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number = 0, cameraY: number = 0) {
    if (!this.state.active) return;

    const renderX = this.state.x - cameraX;
    const renderY = this.state.y - cameraY;

    ctx.save();

    // Efeito de pulso
    const pulseScale = 1 + Math.sin(this.pulseTimer) * 0.1;
    const size = this.state.width * pulseScale;

    // Glow verde ao redor
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 15 + Math.sin(this.pulseTimer) * 5;

    if (this.imageLoaded && this.image) {
      ctx.drawImage(
        this.image,
        renderX - size / 2,
        renderY - size / 2,
        size,
        size
      );
    } else {
      // Fallback: desenhar cruz verde
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(renderX - size / 2, renderY - size / 2, size, size);

      // Cruz branca
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(renderX - size / 2 + size * 0.3, renderY - size / 2 + size * 0.1, size * 0.4, size * 0.8);
      ctx.fillRect(renderX - size / 2 + size * 0.1, renderY - size / 2 + size * 0.3, size * 0.8, size * 0.4);
    }

    ctx.restore();
  }

  checkCollision(playerX: number, playerY: number, playerRadius: number): boolean {
    if (!this.state.active) return false;

    const dx = this.state.x - playerX;
    const dy = this.state.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < (this.state.width / 2 + playerRadius);
  }

  collect(): number {
    if (!this.state.active) return 0;

    this.state.active = false;
    return this.state.healPercentage;
  }

  isActive(): boolean {
    return this.state.active;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.state.x, y: this.state.y };
  }

  getState(): MedkitState {
    return { ...this.state };
  }
}
