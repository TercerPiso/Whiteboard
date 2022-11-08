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

export enum PenModes {
  PAINT = 'PAINT',
  CLEAR = 'CLEAR'
}

export class PenRgb {
  public red: number;
  public green: number;
  public blue: number;

  constructor(r: number, g: number, b: number) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  getRGBA(alpha: number) {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${alpha})`;
  }

  getRGB() {
    return `rgba(${this.red}, ${this.green}, ${this.blue})`;
  }
}
