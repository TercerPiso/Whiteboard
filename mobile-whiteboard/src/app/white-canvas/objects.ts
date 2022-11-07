/* eslint-disable @typescript-eslint/naming-convention */
export class Point {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    if(x !== undefined) {
      this.x = x;
    }
    if(y !== undefined) {
      this.y = y;
    }
  }
}

export enum MouseActions {
  MOVE,
  OUT,
  UP,
  DOWN,
}
