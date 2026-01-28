import { Enemy } from '../entities/Enemy';
import { GAME_CONFIG } from '../config/gameConfig';
import { ENEMY_DEFINITIONS, getBossEnemies, getNonBossEnemies } from '../data/EnemyDatabase';
import { EnemyDefinition } from '../types/EnemyTypes';

export class EnemySpawner {
  private enemies: Enemy[] = [];
  private spawnTimer: number = 0;
  private spawnRate: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private difficulty: number = 1;
  private nextBossTime: number;
  private activeBoss: Enemy | null = null;
  private enemyPool: EnemyDefinition[];
  private firstBossDefeated: boolean = false;
  private bossesDefeated: number = 0;

  constructor(canvasWidth: number, canvasHeight: number, spawnRate: number = 1) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.spawnRate = spawnRate;
    this.nextBossTime = GAME_CONFIG.enemies.bossInterval || 300;
    this.enemyPool = getNonBossEnemies();
  }

  update(deltaTime: number, gameTime: number) {
    this.spawnTimer += deltaTime;

    // Increase difficulty over time
    this.difficulty = 1 + (gameTime / 60) * GAME_CONFIG.waves.difficultyIncreaseRate;

    // Spawn regular enemies
    if (this.spawnTimer >= this.spawnRate / this.difficulty) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Spawn boss every interval
    if (!this.activeBoss && gameTime >= this.nextBossTime) {
      this.spawnBoss();
      this.nextBossTime += GAME_CONFIG.enemies.bossInterval || 300;
    }

    // Clean up inactive enemies
    this.enemies = this.enemies.filter(enemy => enemy.getState().active);

    // Clear boss reference when dead and track first boss defeat
    if (this.activeBoss && !this.activeBoss.getState().active) {
      this.firstBossDefeated = true;
      this.bossesDefeated++;
      this.activeBoss = null;
    }
  }

  private spawnEnemy() {
    // Spawn at random edge of screen
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;

    switch (side) {
      case 0: // Top
        x = Math.random() * this.canvasWidth;
        y = -50;
        break;
      case 1: // Right
        x = this.canvasWidth + 50;
        y = Math.random() * this.canvasHeight;
        break;
      case 2: // Bottom
        x = Math.random() * this.canvasWidth;
        y = this.canvasHeight + 50;
        break;
      case 3: // Left
        x = -50;
        y = Math.random() * this.canvasHeight;
        break;
    }

    const definition = this.pickEnemyDefinition();
    const enemy = new Enemy(definition, x, y);
    this.enemies.push(enemy);
  }

  private spawnBoss() {
    const bosses = getBossEnemies();
    if (bosses.length === 0) return;
    const bossDef = bosses[Math.floor(Math.random() * bosses.length)];
    // Spawn near edges to give player time
    const side = Math.floor(Math.random() * 4);
    let x = this.canvasWidth / 2;
    let y = this.canvasHeight / 2;
    const offset = 200;
    switch (side) {
      case 0:
        x = Math.random() * this.canvasWidth;
        y = -offset;
        break;
      case 1:
        x = this.canvasWidth + offset;
        y = Math.random() * this.canvasHeight;
        break;
      case 2:
        x = Math.random() * this.canvasWidth;
        y = this.canvasHeight + offset;
        break;
      default:
        x = -offset;
        y = Math.random() * this.canvasHeight;
        break;
    }

    const boss = new Enemy(bossDef, x, y);
    this.activeBoss = boss;
    this.enemies.push(boss);
  }

  private pickEnemyDefinition(): EnemyDefinition {
    // Filtra inimigos elite se o primeiro boss ainda não foi derrotado
    let availableEnemies = this.enemyPool;
    if (!this.firstBossDefeated) {
      availableEnemies = this.enemyPool.filter(def =>
        !def.id.includes('elite')
      );
    }

    // Fallback para pool completo se não houver inimigos não-elite
    if (availableEnemies.length === 0) {
      availableEnemies = this.enemyPool;
    }

    const totalWeight = availableEnemies.reduce((acc, def) => acc + (def.weight || 1), 0);
    let roll = Math.random() * totalWeight;
    for (const def of availableEnemies) {
      roll -= def.weight || 1;
      if (roll <= 0) return def;
    }
    return availableEnemies[0];
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  getActiveBoss(): Enemy | null {
    return this.activeBoss;
  }

  clear() {
    this.enemies = [];
    this.activeBoss = null;
  }
}
