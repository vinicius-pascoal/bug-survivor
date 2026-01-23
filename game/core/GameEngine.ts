export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  deltaTime: number;
  lastTimestamp: number;
  elapsedTime: number;
}

export interface Entity {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private animationFrameId: number | null = null;
  private updateCallbacks: Array<(deltaTime: number) => void> = [];
  private renderCallbacks: Array<(ctx: CanvasRenderingContext2D) => void> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;

    this.state = {
      isRunning: false,
      isPaused: false,
      deltaTime: 0,
      lastTimestamp: 0,
      elapsedTime: 0,
    };
  }

  start() {
    if (!this.state.isRunning) {
      this.state.isRunning = true;
      this.state.isPaused = false;
      this.state.lastTimestamp = performance.now();
      this.gameLoop(this.state.lastTimestamp);
    }
  }

  pause() {
    this.state.isPaused = true;
  }

  resume() {
    if (this.state.isPaused) {
      this.state.isPaused = false;
      this.state.lastTimestamp = performance.now();
    }
  }

  stop() {
    this.state.isRunning = false;
    this.state.isPaused = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private gameLoop(timestamp: number) {
    if (!this.state.isRunning) return;

    // Calculate delta time
    this.state.deltaTime = (timestamp - this.state.lastTimestamp) / 1000;
    this.state.lastTimestamp = timestamp;

    if (!this.state.isPaused) {
      this.state.elapsedTime += this.state.deltaTime;

      // Update phase
      this.update(this.state.deltaTime);

      // Render phase
      this.render();
    }

    this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  private update(deltaTime: number) {
    this.updateCallbacks.forEach(callback => callback(deltaTime));
  }

  private render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render callbacks
    this.renderCallbacks.forEach(callback => callback(this.ctx));
  }

  onUpdate(callback: (deltaTime: number) => void) {
    this.updateCallbacks.push(callback);
  }

  onRender(callback: (ctx: CanvasRenderingContext2D) => void) {
    this.renderCallbacks.push(callback);
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getElapsedTime(): number {
    return this.state.elapsedTime;
  }

  isRunning(): boolean {
    return this.state.isRunning;
  }

  isPaused(): boolean {
    return this.state.isPaused;
  }
}
