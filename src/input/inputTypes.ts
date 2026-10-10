export interface Vector2D {
  x: number;
  y: number;
}

export interface JoystickData {
  vector: Vector2D;
  angle: number;
  distance: number;
  active: boolean;
}

export type GestureType = 'TAP' | 'DOUBLE_TAP' | 'SWIPE_UP' | 'SWIPE_DOWN' | 'SWIPE_LEFT' | 'SWIPE_RIGHT' | 'PINCH' | 'LONG_PRESS';

export interface TouchControlState {
  joystick: JoystickData;
  isInteracting: boolean;
  isJumping: boolean;
  isRunning: boolean;
}
