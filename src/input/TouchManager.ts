export class TouchManager {
  private static isTouch: boolean = false;

  static init(): void {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static isTouchDevice(): boolean {
    return this.isTouch || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }

  static preventScrollOnElement(elem: HTMLElement | null): void {
    if (!elem) return;
    elem.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }
}
