export interface AreaEffectConfig {
  id: string;
  name: string;
  description: string;
  baseDamage: number;
  radius: number;
  cooldown: number;
  level: number;
  currentLevel: number;
  cost: number;
  prerequisites: string[];
  animationPath: string;
  frameCount: number;
  frameDuration: number;
}

export interface AreaEffect {
  id: string;
  x: number;
  y: number;
  damage: number;
  radius: number;
  currentFrame: number;
  totalFrames: number;
  frameDuration: number;
  elapsedTime: number;
  active: boolean;
  imageFrame?: HTMLImageElement;
}

export type AreaEffectType = 'lightning' | 'fire' | 'atomic' | 'toxic' | 'water-fire' | 'electric' | 'default';
