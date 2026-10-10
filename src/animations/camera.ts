export interface CameraCoordinates {
  x: number;
  y: number;
  z: number;
}

export const DEFAULT_CAMERA: CameraCoordinates = {
  x: 0,
  y: 0,
  z: 15,
};

export const WARP_CAMERA: CameraCoordinates = {
  x: 0,
  y: 0,
  z: 2,
};