import { GestureType } from './inputTypes';

export class GestureManager {
  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  private onGestureCallback: (gesture: GestureType) => void;

  constructor(onGesture: (gesture: GestureType) => void) {
    this.onGestureCallback = onGesture;
  }

  handleTouchStart(e: React.TouchEvent): void {
    if (e.touches.length === 1) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.startTime = Date.now();
    }
  }

  handleTouchEnd(e: React.TouchEvent): void {
    if (e.changedTouches.length === 1) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const duration = Date.now() - this.startTime;

      const diffX = endX - this.startX;
      const diffY = endY - this.startY;
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);

      // Swipe detection (min 40px within 500ms)
      if (duration < 500 && (absX > 40 || absY > 40)) {
        if (absX > absY) {
          this.onGestureCallback(diffX > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT');
        } else {
          this.onGestureCallback(diffY > 0 ? 'SWIPE_DOWN' : 'SWIPE_UP');
        }
      } else if (duration < 250 && absX < 10 && absY < 10) {
        this.onGestureCallback('TAP');
      }
    }
  }
}
