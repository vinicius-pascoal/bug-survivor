import { WeaponData } from '../types/WeaponTypes';

export interface ChestState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  opened: boolean;
  weaponData: WeaponData;
  image: HTMLImageElement | null;
  imageLoaded: boolean;
  glowIntensity: number;
}

export class Chest {
  private state: ChestState;
  private glowDirection: number = 1;

  constructor(id: string, x: number, y: number, weaponData: WeaponData) {
    this.state = {
      id,
      x,
      y,
      width: 48,
      height: 48,
      active: true,
      opened: false,
      weaponData,
      image: null,
      imageLoaded: false,
      glowIntensity: 0.5,
    };

    this.loadImage();
  }

  private loadImage() {
    const img = new Image();
    img.src = '/bau.png';
    img.onload = () => {
      this.state.image = img;
      this.state.imageLoaded = true;
    };
    img.onerror = () => {
      console.error('Failed to load chest image');
      this.state.imageLoaded = false;
    };
  }

  update(deltaTime: number) {
    if (!this.state.active || this.state.opened) return;

    // Anima o brilho do baú
    this.state.glowIntensity += this.glowDirection * deltaTime * 0.5;

    if (this.state.glowIntensity >= 1) {
      this.state.glowIntensity = 1;
      this.glowDirection = -1;
    } else if (this.state.glowIntensity <= 0.3) {
      this.state.glowIntensity = 0.3;
      this.glowDirection = 1;
    }
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number = 0, cameraY: number = 0) {
    if (!this.state.active || this.state.opened) return;

    const screenX = this.state.x - cameraX;
    const screenY = this.state.y - cameraY;

    ctx.save();

    // Desenha brilho baseado na raridade da arma
    const rarityColors = {
      common: '#9ca3af',
      uncommon: '#22c55e',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#eab308',
    };

    const glowColor = rarityColors[this.state.weaponData.rarity];

    // Efeito de brilho pulsante
    ctx.shadowBlur = 20 + (this.state.glowIntensity * 20);
    ctx.shadowColor = glowColor;

    // Desenha círculo de brilho no chão
    ctx.beginPath();
    ctx.arc(screenX, screenY + this.state.height / 2, this.state.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = glowColor + '33'; // 20% opacity
    ctx.fill();

    // Desenha o baú
    if (this.state.imageLoaded && this.state.image) {
      // Adiciona brilho extra ao redor do baú
      ctx.shadowBlur = 30 * this.state.glowIntensity;
      ctx.shadowColor = glowColor;

      ctx.drawImage(
        this.state.image,
        screenX - this.state.width / 2,
        screenY - this.state.height / 2,
        this.state.width,
        this.state.height
      );
    } else {
      // Fallback: desenha retângulo se imagem não carregar
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(
        screenX - this.state.width / 2,
        screenY - this.state.height / 2,
        this.state.width,
        this.state.height
      );

      // Adiciona detalhes
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(
        screenX - this.state.width / 2 + 5,
        screenY,
        this.state.width - 10,
        5
      );
    }

    // Desenha indicador acima do baú
    const indicatorY = screenY - this.state.height;
    const bounce = Math.sin(Date.now() / 200) * 3;

    ctx.shadowBlur = 10;
    ctx.shadowColor = glowColor;

    // Desenha seta ou exclamação
    ctx.fillStyle = glowColor;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('!', screenX, indicatorY + bounce);

    ctx.restore();
  }

  // Verifica colisão com o jogador
  checkCollision(playerX: number, playerY: number, playerRadius: number = 32): boolean {
    if (!this.state.active || this.state.opened) return false;

    const dx = this.state.x - playerX;
    const dy = this.state.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < (this.state.width / 2 + playerRadius);
  }

  // Abre o baú e retorna a arma
  open(): WeaponData {
    this.state.opened = true;
    this.state.active = false;
    return this.state.weaponData;
  }

  getState(): ChestState {
    return { ...this.state };
  }

  getPosition(): { x: number; y: number } {
    return { x: this.state.x, y: this.state.y };
  }

  getWeaponData(): WeaponData {
    return this.state.weaponData;
  }

  isActive(): boolean {
    return this.state.active && !this.state.opened;
  }

  isOpened(): boolean {
    return this.state.opened;
  }

  getId(): string {
    return this.state.id;
  }
}
