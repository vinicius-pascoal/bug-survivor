import { Medkit } from '../entities/Medkit';
import { GAME_CONFIG } from '../config/gameConfig';

export class MedkitSpawner {
  private medkits: Medkit[] = [];
  private spawnTimer: number = 0;
  private minSpawnInterval: number = 15; // mínimo 15 segundos
  private maxSpawnInterval: number = 30; // máximo 30 segundos
  private nextSpawnTime: number = 20; // primeiro spawn em 20 segundos
  private maxMedkits: number = 3; // máximo de medkits simultâneos
  private nextMedkitId: number = 0;

  constructor() {
    this.nextSpawnTime = this.getRandomSpawnTime();
  }

  private getRandomSpawnTime(): number {
    return this.minSpawnInterval + Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
  }

  update(deltaTime: number, playerX: number, playerY: number) {
    this.spawnTimer += deltaTime;

    // Spawna novo medkit em tempo aleatório
    if (this.spawnTimer >= this.nextSpawnTime && this.medkits.length < this.maxMedkits) {
      this.spawnRandomMedkit(playerX, playerY);
      this.spawnTimer = 0;
      this.nextSpawnTime = this.getRandomSpawnTime();
    }

    // Atualiza todos os medkits
    this.medkits.forEach(medkit => medkit.update(deltaTime));

    // Remove medkits inativos
    this.medkits = this.medkits.filter(medkit => medkit.isActive());
  }

  private spawnRandomMedkit(playerX: number, playerY: number) {
    // Spawna medkit em uma posição aleatória ao redor do jogador
    // Não muito perto (entre 250 e 600 pixels)
    const angle = Math.random() * Math.PI * 2;
    const minDistance = 250;
    const maxDistance = 600;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);

    let x = playerX + Math.cos(angle) * distance;
    let y = playerY + Math.sin(angle) * distance;

    // Mantém dentro dos limites do mapa
    x = Math.max(50, Math.min(GAME_CONFIG.canvas.width - 50, x));
    y = Math.max(50, Math.min(GAME_CONFIG.canvas.height - 50, y));

    this.spawnMedkit(x, y);
  }

  private spawnMedkit(x: number, y: number) {
    const medkit = new Medkit(`medkit_${this.nextMedkitId++}`, x, y, 0.2); // 20% de cura
    this.medkits.push(medkit);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number = 0, cameraY: number = 0) {
    this.medkits.forEach(medkit => medkit.render(ctx, cameraX, cameraY));
  }

  checkCollisions(playerX: number, playerY: number, playerRadius: number = 32): Medkit | null {
    for (const medkit of this.medkits) {
      if (medkit.checkCollision(playerX, playerY, playerRadius)) {
        return medkit;
      }
    }
    return null;
  }

  getActiveMedkits(): Medkit[] {
    return this.medkits.filter(medkit => medkit.isActive());
  }

  clear() {
    this.medkits = [];
    this.spawnTimer = 0;
    this.nextSpawnTime = this.getRandomSpawnTime();
  }
}
