export enum SwipeEvent {
  REMOVE = 'remove',
  TOGGLE = 'toggle'
}

export interface SwipeCoords {
  x: number;
  y: number;
  initialDeltaX?: number;
  initialDeltaY?: number;
}
