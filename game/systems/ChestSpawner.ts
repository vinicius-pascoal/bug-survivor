import { Chest } from '../entities/Chest';
import { getRandomWeapon } from '../data/WeaponsDatabase';
import { GAME_CONFIG } from '../config/gameConfig';

export class ChestSpawner {
  private chests: Chest[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = 30; // segundos entre spawns
  private maxChests: number = 5; // máximo de baús simultâneos
  private nextChestId: number = 0;
  private playerLevel: number = 1;

  constructor() {
    // Spawna um baú inicial
    this.spawnInitialChest();
  }

  private spawnInitialChest() {
    // Spawna o primeiro baú próximo ao centro mas não muito perto
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 200;
    const x = GAME_CONFIG.canvas.width / 2 + Math.cos(angle) * distance;
    const y = GAME_CONFIG.canvas.height / 2 + Math.sin(angle) * distance;

    this.spawnChest(x, y);
  }

  update(deltaTime: number, playerLevel: number, playerX: number, playerY: number) {
    this.playerLevel = playerLevel;

    // Atualiza timer de spawn
    this.spawnTimer += deltaTime;

    // Spawna novo baú se necessário
    if (this.spawnTimer >= this.spawnInterval && this.chests.length < this.maxChests) {
      this.spawnRandomChest(playerX, playerY);
      this.spawnTimer = 0;
    }

    // Atualiza todos os baús
    this.chests.forEach(chest => chest.update(deltaTime));

    // Remove baús inativos (já abertos)
    this.chests = this.chests.filter(chest => chest.isActive());
  }

  private spawnChest(x: number, y: number) {
    const weaponData = getRandomWeapon(this.playerLevel);
    const chest = new Chest(`chest_${this.nextChestId++}`, x, y, weaponData);
    this.chests.push(chest);
  }

  private spawnRandomChest(playerX: number, playerY: number) {
    // Spawna baú em uma posição aleatória ao redor do jogador
    // mas não muito perto (entre 200 e 500 pixels)
    const angle = Math.random() * Math.PI * 2;
    const minDistance = 200;
    const maxDistance = 500;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);

    let x = playerX + Math.cos(angle) * distance;
    let y = playerY + Math.sin(angle) * distance;

    // Mantém dentro dos limites do mapa
    x = Math.max(50, Math.min(GAME_CONFIG.canvas.width - 50, x));
    y = Math.max(50, Math.min(GAME_CONFIG.canvas.height - 50, y));

    this.spawnChest(x, y);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number = 0, cameraY: number = 0) {
    this.chests.forEach(chest => chest.render(ctx, cameraX, cameraY));
  }

  // Verifica colisões com o jogador
  checkCollisions(playerX: number, playerY: number, playerRadius: number = 32): Chest | null {
    for (const chest of this.chests) {
      if (chest.checkCollision(playerX, playerY, playerRadius)) {
        return chest;
      }
    }
    return null;
  }

  // Retorna todos os baús ativos
  getActiveChests(): Chest[] {
    return this.chests.filter(chest => chest.isActive());
  }

  // Spawna baú em posição específica (útil para eventos)
  spawnChestAt(x: number, y: number) {
    this.spawnChest(x, y);
  }

  // Limpa todos os baús
  clear() {
    this.chests = [];
    this.spawnTimer = 0;
  }

  // Define intervalo de spawn
  setSpawnInterval(seconds: number) {
    this.spawnInterval = seconds;
  }

  // Define máximo de baús
  setMaxChests(max: number) {
    this.maxChests = max;
  }
}
