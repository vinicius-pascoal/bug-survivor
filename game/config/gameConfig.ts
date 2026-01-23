export const GAME_CONFIG = {
  // Canvas
  canvas: {
    width: 1920,
    height: 1080,
  },

  // Player
  player: {
    speed: 200, // pixels per second
    size: 32,
    maxHealth: 100,
  },

  // Enemies
  enemies: {
    spawnRate: 1, // seconds
    minSpeed: 50,
    maxSpeed: 150,
    baseSize: 24,
  },

  // Weapons
  weapons: {
    dataDisk: {
      damage: 10,
      speed: 3, // rotation speed
      count: 3,
      radius: 80,
    },
  },

  // Experience
  xp: {
    levelUpBase: 100,
    levelUpMultiplier: 1.5,
  },

  // Waves
  waves: {
    initialDifficulty: 1,
    difficultyIncreaseRate: 0.1, // per minute
  },
} as const;
