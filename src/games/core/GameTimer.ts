export class GameTimer {
  private startTime: number = 0;
  private elapsed: number = 0;
  private timerId: any = null;
  private onTick?: (seconds: number) => void;

  constructor(onTick?: (seconds: number) => void) {
    this.onTick = onTick;
  }

  start(): void {
    this.startTime = Date.now() - this.elapsed * 1000;
    this.timerId = setInterval(() => {
      this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.onTick) this.onTick(this.elapsed);
    }, 1000);
  }

  pause(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  resume(): void {
    this.start();
  }

  reset(): void {
    this.pause();
    this.elapsed = 0;
    if (this.onTick) this.onTick(0);
  }

  getElapsed(): number {
    return this.elapsed;
  }

  getElapsedSeconds(): number {
    return this.elapsed;
  }
}
