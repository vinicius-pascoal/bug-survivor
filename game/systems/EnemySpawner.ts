import { Enemy } from '../entities/Enemy';
import { generateId } from '@/utils/helpers';
import { GAME_CONFIG } from '../config/gameConfig';

export class EnemySpawner {
  private enemies: Enemy[] = [];
  private spawnTimer: number = 0;
  private spawnRate: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private difficulty: number = 1;

  constructor(canvasWidth: number, canvasHeight: number, spawnRate: number = 1) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.spawnRate = spawnRate;
  }

  update(deltaTime: number, gameTime: number) {
    this.spawnTimer += deltaTime;

    // Increase difficulty over time
    this.difficulty = 1 + (gameTime / 60) * GAME_CONFIG.waves.difficultyIncreaseRate;

    // Spawn enemies
    if (this.spawnTimer >= this.spawnRate / this.difficulty) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Clean up inactive enemies
    this.enemies = this.enemies.filter(enemy => enemy.getState().active);
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

    const enemy = new Enemy(generateId(), x, y);
    this.enemies.push(enemy);
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  clear() {
    this.enemies = [];
  }
}
